import { config } from 'dotenv'
import * as path from 'path'

const ENV_FILE = '.env.production.local'

const env = config({
  path: path.resolve(process.cwd(), ENV_FILE)
})

if (!env.error) {
  const subpath = env.parsed.NEXT_PUBLIC_TCB_SUBPATH
  const envId = env.parsed.NEXT_PUBLIC_TCB_ENV_ID

  // ❕ 注意部署强制要求在子路径下
  if (envId && subpath) {
    await $`rm -rf out`
    await $`tcb hosting delete ${subpath} -e ${envId}`
    await $`yarn build`
    console.log(chalk.green('🎉🎉🎉 成功编译代码'))
    await $`tcb hosting deploy ./out ${subpath} -e ${envId}`
    console.log(chalk.green('🎉🎉🎉 成功部署网站'))
  } else {
    console.log(chalk.red(`请检查 ${ENV_FILE} 内的 NEXT_PUBLIC_TCB_ENV_ID 和 NEXT_PUBLIC_TCB_SUBPATH 变量是否填写`))
  }
} else {
  console.log(chalk.red('😭😭😭 部署失败'))
}