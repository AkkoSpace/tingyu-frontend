<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="handleUpdatePassword">
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.deleteAccount') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.deleteAccount') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="handleDeleteAccount">
              {{ $t('userSetting.SecuritySettings.button.deleteAccount') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
  <a-modal
    v-model:visible="visible"
    :cancel-button-props="{ shape: 'round' }"
    :cancel-text="
      $t('userSetting.SecuritySettings.modal.cancelText.updatePassword')
    "
    :ok-button-props="{ shape: 'round' }"
    :ok-text="$t('userSetting.SecuritySettings.modal.okText.updatePassword')"
    :title="$t('userSetting.SecuritySettings.modal.title.updatePassword')"
    @cancel="handleUpdatePasswordCancel"
    @ok="handleUpdatePasswordOk"
  >
    <div class="content">
      <a-form
        :ref="updatePasswordFormRef"
        :model-value="updatePassword"
        label-width="120"
      >
        <a-form-item
          :label="$t('userSetting.SecuritySettings.form.label.oldPassword')"
          :rules="[
            {
              required: true,
              message: $t(
                'userSetting.SecuritySettings.placeholder.oldPassword'
              ),
            },
          ]"
          name="oldPassword"
        >
          <a-input
            v-model:value="updatePassword.oldPassword"
            :placeholder="
              $t('userSetting.SecuritySettings.placeholder.oldPassword')
            "
            type="password"
          />
        </a-form-item>
        <a-form-item
          :label="$t('userSetting.SecuritySettings.form.label.newPassword')"
          :rules="[
            {
              required: true,
              message: $t(
                'userSetting.SecuritySettings.placeholder.newPassword'
              ),
            },
          ]"
          name="newPassword"
        >
          <a-input
            v-model:value="updatePassword.newPassword"
            :placeholder="
              $t('userSetting.SecuritySettings.placeholder.newPassword')
            "
            type="password"
          />
        </a-form-item>
        <a-form-item
          :label="$t('userSetting.SecuritySettings.form.label.checkPassword')"
          :rules="[
            {
              required: true,
              message: $t(
                'userSetting.SecuritySettings.placeholder.checkPassword'
              ),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    $t(
                      'userSetting.SecuritySettings.placeholder.checkPassword' +
                        'Error'
                    )
                  )
                );
              },
            }),
          ]"
          name="checkPassword"
        >
          <a-input
            v-model:value="updatePassword.checkPassword"
            :placeholder="
              $t('userSetting.SecuritySettings.placeholder.checkPassword')
            "
            type="password"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import { ref } from 'vue';

  const { t } = useI18n();

  const userStore = useUserStore();
  const { userInfo } = userStore;
  const id = userInfo?.id;

  const visible = ref(false);
  const updatePassword = ref({
    oldPassword: '',
    newPassword: '',
    checkPassword: '',
  });

  const updatePasswordFormRef = ref();
  const handleUpdatePasswordCancel = () => {
    visible.value = false;
  };

  const handleUpdatePasswordOk = async () => {
    const errors = await updatePasswordFormRef.value?.validate();
    console.log("errors",errors);
    // await userStore.updatePassword({
    //   ...updatePassword.value,
    // });
  };

  const handleUpdatePassword = () => {
    visible.value = true;
  };
  const handleDeleteAccount = () => {
    Modal.error({
      hideCancel: false,
      okButtonProps: {
        shape: 'round',
        status: 'danger',
      },
      cancelButtonProps: {
        shape: 'round',
      },
      title: t('userSetting.SecuritySettings.modal.title'),
      content: t('userSetting.SecuritySettings.modal.content'),
      okText: t('userSetting.SecuritySettings.modal.okText'),
      cancelText: t('userSetting.SecuritySettings.modal.cancelText'),
      async onOk() {
        if (id) {
          await userStore.delete({ id });
          window.location.reload();
        }
      },
    });
  };
</script>

<style lang="less" scoped>
  :deep(.arco-list-item) {
    border-bottom: none !important;

    .arco-typography {
      margin-bottom: 20px;
    }

    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }

    .arco-list-item-meta {
      padding: 0;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }

      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
