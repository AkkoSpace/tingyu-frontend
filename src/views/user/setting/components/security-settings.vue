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
            <a-link>
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
    <!--    <a-list-item>-->
    <!--      <a-list-item-meta>-->
    <!--        <template #avatar>-->
    <!--          <a-typography-paragraph>-->
    <!--            {{ $t('userSetting.SecuritySettings.form.label.securityQuestion') }}-->
    <!--          </a-typography-paragraph>-->
    <!--        </template>-->
    <!--        <template #description>-->
    <!--          <div class="content">-->
    <!--            <a-typography-paragraph class="tip">-->
    <!--              {{-->
    <!--                $t('userSetting.SecuritySettings.placeholder.securityQuestion')-->
    <!--              }}-->
    <!--            </a-typography-paragraph>-->
    <!--          </div>-->
    <!--          <div class="operation">-->
    <!--            <a-link>-->
    <!--              {{ $t('userSetting.SecuritySettings.button.settings') }}-->
    <!--            </a-link>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </a-list-item-meta>-->
    <!--    </a-list-item>-->
    <!--    <a-list-item>-->
    <!--      <a-list-item-meta>-->
    <!--        <template #avatar>-->
    <!--          <a-typography-paragraph>-->
    <!--            {{ $t('userSetting.SecuritySettings.form.label.phone') }}-->
    <!--          </a-typography-paragraph>-->
    <!--        </template>-->
    <!--        <template #description>-->
    <!--          <div class="content">-->
    <!--            <a-typography-paragraph>-->
    <!--              已绑定：150******50-->
    <!--            </a-typography-paragraph>-->
    <!--          </div>-->
    <!--          <div class="operation">-->
    <!--            <a-link>-->
    <!--              {{ $t('userSetting.SecuritySettings.button.update') }}-->
    <!--            </a-link>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </a-list-item-meta>-->
    <!--    </a-list-item>-->
    <!--    <a-list-item>-->
    <!--      <a-list-item-meta>-->
    <!--        <template #avatar>-->
    <!--          <a-typography-paragraph>-->
    <!--            {{ $t('userSetting.SecuritySettings.form.label.email') }}-->
    <!--          </a-typography-paragraph>-->
    <!--        </template>-->
    <!--        <template #description>-->
    <!--          <div class="content">-->
    <!--            <a-typography-paragraph class="tip">-->
    <!--              {{ $t('userSetting.SecuritySettings.placeholder.email') }}-->
    <!--            </a-typography-paragraph>-->
    <!--          </div>-->
    <!--          <div class="operation">-->
    <!--            <a-link>-->
    <!--              {{ $t('userSetting.SecuritySettings.button.update') }}-->
    <!--            </a-link>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </a-list-item-meta>-->
    <!--    </a-list-item>-->
  </a-list>
</template>

<script lang="ts" setup>
  import { Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';

  const { t } = useI18n();

  const userStore = useUserStore();
  const { userInfo } = userStore;
  const id = userInfo?.id;
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
