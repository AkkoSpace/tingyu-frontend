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
      <a-form :model-value="updatePassword" :rules="rules" label-width="120">
        <a-form-item label="当前密码" name="currentPassword">
          <a-input
            v-model:value="updatePassword.currentPassword"
            placeholder="请输入当前密码"
            type="password"
          />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input
            v-model:value="updatePassword.newPassword"
            placeholder="请输入新密码"
            type="password"
          />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassword">
          <a-input
            v-model:value="updatePassword.confirmPassword"
            placeholder="请再次输入新密码"
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
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const rules = {
    currentPassword: [
      {
        required: true,
        message: t('userSetting.SecuritySettings.form.message.currentPassword'),
      },
    ],
    newPassword: [
      {
        required: true,
        message: t('userSetting.SecuritySettings.form.message.newPassword'),
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: t('userSetting.SecuritySettings.form.message.confirmPassword'),
      },
    ],
  };
  const handleUpdatePasswordCancel = () => {
    visible.value = false;
  };

  const handleUpdatePasswordOk = () => {
    visible.value = false;
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
