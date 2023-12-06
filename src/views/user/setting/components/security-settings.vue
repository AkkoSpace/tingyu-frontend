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
    :closable="false"
    :footer="false"
    :mask-closable="false"
    :title="$t('userSetting.SecuritySettings.modal.title.updatePassword')"
  >
    <div class="content">
      <a-form ref="formRef" :model="updatePassword" label-width="120">
        <a-form-item
          :label="$t('userSetting.SecuritySettings.form.label.oldPassword')"
          :rules="[
            {
              required: true,
              message: $t(
                'userSetting.SecuritySettings.placeholder.oldPassword'
              ),
            },
            {
              validator: checkPassword,
            },
          ]"
          field="oldPassword"
        >
          <a-input
            v-model="updatePassword.oldPassword"
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
            {
              validator: checkPassword,
            },
          ]"
          field="newPassword"
        >
          <a-input
            v-model="updatePassword.newPassword"
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
            {
              validator: checkCheckPassword,
            },
          ]"
          field="checkPassword"
        >
          <a-input
            v-model="updatePassword.checkPassword"
            :placeholder="
              $t('userSetting.SecuritySettings.placeholder.checkPassword')
            "
            type="password"
          />
        </a-form-item>
        <a-form-item>
          <a-space style="display: flex; justify-content: space-between">
            <a-button
              shape="round"
              type="secondary"
              @click="handleUpdatePasswordCancel"
            >
              {{ $t('userSetting.SecuritySettings.updatePasswordCancel') }}
            </a-button>
            <a-button
              :loading="loading"
              shape="round"
              style="margin-left: 8px"
              type="primary"
              @click="handleUpdatePasswordOk"
            >
              {{ $t('userSetting.SecuritySettings.updatePasswordOk') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <!--defined a blank div to hide ok -->
      <div></div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import lodash from 'lodash';
  import { encryptPassword } from '@/utils/auth';

  const { t } = useI18n();

  const userStore = useUserStore();
  const { userInfo } = userStore;
  const id = userInfo?.id;

  const { loading, setLoading } = useLoading();
  const visible = ref(false);
  const formRef = ref<FormInstance>();
  const updatePassword = ref({
    oldPassword: '',
    newPassword: '',
    checkPassword: '',
  });

  const checkPassword = async (value: string, callback: any) => {
    if (value.length < 6 || value.length > 20) {
      callback(t('userSetting.SecuritySettings.form.error.passwordLength'));
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback(t('userSetting.SecuritySettings.form.error.passwordFormat'));
    } else {
      callback();
    }
  };

  const checkCheckPassword = async (value: string, callback: any) => {
    if (value.length < 6 || value.length > 20) {
      callback(t('userSetting.SecuritySettings.form.error.passwordLength'));
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback(t('userSetting.SecuritySettings.form.error.passwordFormat'));
    } else if (value !== updatePassword.value.newPassword) {
      callback(t('userSetting.SecuritySettings.form.error.passwordUnmatched'));
    } else {
      callback();
    }
  };

  const handleUpdatePasswordCancel = () => {
    visible.value = false;
    formRef.value?.resetFields();
  };

  const handleUpdatePasswordOk = async () => {
    setLoading(true);
    try {
      const res = await formRef.value?.validate();
      const encryptValues = lodash.cloneDeep(updatePassword.value);
      encryptValues.oldPassword = encryptPassword(
        encryptValues.oldPassword
      ) as string;
      encryptValues.newPassword = encryptPassword(
        encryptValues.newPassword
      ) as string;
      if (!res) {
        await userStore.updatePassword({
          oldPassword: encryptValues.oldPassword,
          newPassword: encryptValues.newPassword,
        });
        window.location.reload();
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
