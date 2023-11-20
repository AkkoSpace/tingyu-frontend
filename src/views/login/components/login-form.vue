<template>
  <div class="login-form-wrapper">
    <a-card class="login-form-out-card">
      <a-row v-if="loginType === 'login'" align="center">
        <a-col :offset="1" :span="12">
          <img src="src/assets/images/login/login-bg.svg" style="width: 100%" />
        </a-col>
        <a-col :offset="1" :span="9">
          <a-card :bordered="false">
            <div class="login-form-title">{{ $t('login.form.title') }}</div>
            <div class="login-form-sub-title"
              >{{ $t('login.form.subTitle') }}
            </div>
            <div class="login-form-error-msg">{{ errorMessage }}</div>
            <a-form
              ref="loginForm"
              :model="userInfo"
              class="login-form"
              layout="vertical"
              @submit="handleLogin"
            >
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.userAccount.errMsg'),
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                field="userAccount"
                hide-label
              >
                <a-input
                  v-model="userInfo.userAccount"
                  :placeholder="$t('login.form.userAccount.placeholder')"
                >
                  <template #prefix>
                    <icon-user />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.userPassword.errMsg'),
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                field="userPassword"
                hide-label
              >
                <a-input-password
                  v-model="userInfo.userPassword"
                  :placeholder="$t('login.form.userPassword.placeholder')"
                  allow-clear
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-space :size="16" direction="vertical">
                <div class="login-form-login-actions">
                  <a-checkbox
                    :model-value="loginConfig.rememberPassword"
                    checked="rememberPassword"
                    @change="setRememberPassword as any"
                  >
                    {{ $t('login.form.rememberPassword') }}
                  </a-checkbox>
                  <a-link @click="clickRegister"
                    >{{ $t('login.form.login.register') }}
                  </a-link>
                </div>
                <a-button
                  :loading="loading"
                  html-type="submit"
                  long
                  shape="round"
                  type="primary"
                >
                  {{ $t('login.form.login') }}
                </a-button>
              </a-space>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
      <a-row v-if="loginType === 'register'" align="center">
        <a-col :offset="1" :span="12">
          <img
            src="src/assets/images/login/register-bg.svg"
            style="width: 100%"
          />
        </a-col>
        <a-col :offset="1" :span="9">
          <a-card :bordered="false">
            <div class="login-form-title">{{ $t('login.form.title') }}</div>
            <div class="login-form-sub-title"
              >{{ $t('login.form.subTitle') }}
            </div>
            <div class="login-form-error-msg">{{ errorMessage }}</div>
            <a-form
              ref="loginForm"
              :model="userInfo"
              class="login-form"
              layout="vertical"
              @submit="handleRegister"
            >
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.userAccount.errMsg'),
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                field="userAccount"
                hide-label
              >
                <a-input
                  v-model="userInfo.userAccount"
                  :placeholder="$t('login.form.userAccount.placeholder')"
                >
                  <template #prefix>
                    <icon-user />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.userPassword.errMsg'),
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                field="userPassword"
                hide-label
              >
                <a-input-password
                  v-model="userInfo.userPassword"
                  :placeholder="
                    $t('login.form.register.userPassword.placeholder')
                  "
                  allow-clear
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.form.userPassword.errMsg'),
                  },
                ]"
                :validate-trigger="['change', 'blur']"
                field="userPassword"
                hide-label
              >
                <a-input-password
                  v-model="userInfo.checkPassword"
                  :placeholder="
                    $t('login.form.register.checkPassword.placeholder')
                  "
                  allow-clear
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-space :size="16" direction="vertical">
                <div class="login-form-register-actions">
                  <a-link @click="clickLogin"
                    >{{ $t('login.form.login.login') }}
                  </a-link>
                </div>
                <a-button
                  :loading="loading"
                  html-type="submit"
                  long
                  shape="round"
                  type="primary"
                >
                  {{ $t('login.form.register') }}
                </a-button>
              </a-space>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData, RegisterData } from '@/api/user';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    userAccount: '',
    userPassword: '',
    checkPassword: '',
  });
  const userInfo = reactive({
    userAccount: loginConfig.value.userAccount,
    userPassword: loginConfig.value.userPassword,
    checkPassword: loginConfig.value.checkPassword,
  });

  const loginType = ref('login');
  const clickRegister = () => {
    loginType.value = 'register';
    // 重置表单
    userInfo.userAccount = '';
    userInfo.userPassword = '';
    errorMessage.value = '';
  };
  const clickLogin = () => {
    loginType.value = 'login';
    // 重置表单
    userInfo.userAccount = '';
    userInfo.userPassword = '';
    errorMessage.value = '';
  };

  const handleLogin = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { userAccount, userPassword } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.userAccount = rememberPassword ? userAccount : '';
        loginConfig.value.userPassword = rememberPassword ? userPassword : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.register(values as RegisterData);
        Message.success(t('login.form.register.success'));
        loginType.value = 'login';
        errorMessage.value = '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .deep(arco-card-body) {
    padding: 0;
  }

  .login-form {
    &-wrapper {
      height: 50vh;
      width: 60vw;
    }

    &-out-card {
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      align-items: center;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
      text-align: center;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-login-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-actions {
      display: flex;
      justify-content: end;
    }
  }
</style>
