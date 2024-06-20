// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateEmail(ctx: Context, next: () => Promise<any>) {
    const {
        vtex: {
            route: {params}
        },
      clients: { MdClient, apps },
    } = ctx
  
    try {
        const appId = process.env.VTEX_APP_ID ? process.env.VTEX_APP_ID : ''
        const { fieldPrize, dataEntity } = await apps.getAppSettings(appId)
        const { email } = params
        
        const response = await MdClient.validateEmailWheel(dataEntity, fieldPrize, email)
        console.info({ response })
  
        ctx.status = 200
        ctx.body = response
        await next()
    } catch (error) {
      console.error('Error:', error)
      ctx.status = 500 
      ctx.body = { error: error.message }
    }
}
