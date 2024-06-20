import { json } from 'co-body'

export async function getPrizeData(ctx: Context, next: () => Promise<any>) {
  try {
    const prizeData: any = await json(ctx.req)
    const { email, prizesEvent, couponEvent } = prizeData
    ctx.state.emailEvent = email
    ctx.state.couponEvent = couponEvent
    ctx.state.prizesEvent = prizesEvent
  } catch (error) {
    console.error('Error en getPrizeData:', error)
    ctx.status = 500
    ctx.body = { error: 'Error al procesar los datos del premio' }
  }

  await next()
}
