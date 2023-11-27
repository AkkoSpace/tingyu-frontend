<template>
  <a-form
    ref="formRef"
    :label-col-props="{ span: 8 }"
    :model="formData"
    :wrapper-col-props="{ span: 16 }"
    class="form"
  >
    <a-form-item
      :label="$t('userSetting.basicInfo.form.label.nickname')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.nickname.required'),
        },
      ]"
      field="userName"
    >
      <a-input
        v-model="formData.userName"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      field="userProfile"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.userProfile"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button :loading="loading" type="primary" @click="update">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { BasicInfoModel } from '@/api/user-center';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { InfoData } from '@/api/user';

  const { loading, setLoading } = useLoading();

  const formRef = ref<FormInstance>();
  const userStore = useUserStore();
  const formData = ref<BasicInfoModel>({
    userName: userStore.userName,
    userProfile: userStore.userProfile,
  });
  const update = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      await userStore.updateInfo(formData.value as InfoData);
      setLoading(false);
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style lang="less" scoped>
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
