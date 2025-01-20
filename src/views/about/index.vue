<script setup >
import pkg from '/package.json';

const { name, version, dependencies, devDependencies } = pkg;

function transformVersionData(tuple){
  const [$name, $version] = tuple;
  return {
    name: $name,
    version: $version
  };
}

const pkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item))
};

const latestBuildTime = '2025-01-17';
</script>

<template>
  <div style="display: flex; flex-direction: column;">
    <a-card title="关于" :bordered="false" size="small" segmented class="card-wrapper card-class">
      <p>{{ pkg.webDesc }}</p>
    </a-card>
    <a-card title="项目信息" :bordered="false" size="small" segmented class="card-wrapper card-class">
      <a-descriptions label-placement="left" bordered size="small" :column="2">
        <a-descriptions-item label="版本">
          <a-tag color="blue">{{ pkgJson.version }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最新构建时间">
          <a-tag color="blue">{{ latestBuildTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Github 地址">
          <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
            Github 地址
          </a>
        </a-descriptions-item>
        <a-descriptions-item label="预览地址">
          <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
            预览地址
          </a>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="生产依赖" :bordered="false" size="small" segmented class="card-wrapper card-class">
      <a-descriptions label-placement="left" bordered size="small" :column="2">
        <a-descriptions-item v-for="item in pkgJson.dependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="开发依赖" :bordered="false" size="small" segmented class="card-wrapper card-class">
      <a-descriptions label-placement="left" bordered size="small" :column="2">
        <a-descriptions-item v-for="item in pkgJson.devDependencies" :key="item.name" :label="item.name">
          {{ item.version }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
.card-class{
  margin-bottom: 24px;
}
</style>
