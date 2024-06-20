export async function savePrize(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata, apps },
  } = ctx;

  try {
    const email = ctx.state.emailEvent;
    const prizeWheel = ctx.state.prizesEvent;
    const couponWheel = ctx.state.couponEvent;
    
    const appId = process.env.VTEX_APP_ID || '';
    const { fieldPrize, fieldCoupon, dataEntity } = await apps.getAppSettings(appId);

    if (!email || !fieldPrize || !fieldCoupon || !dataEntity) {
      const errorMessage = 'Falta alguno de los siguientes valores: email, fieldPrize, fieldCoupon, dataEntity';
      throw new Error(errorMessage);
    }

    const prizeData = {
      dataEntity: dataEntity,
      fields: {
        email: email,
        [fieldPrize]: prizeWheel,
        [fieldCoupon]: couponWheel
      },
    };

    const data = await masterdata.createOrUpdatePartialDocument(prizeData);
    console.log(data);
    
    ctx.status = 200;
    ctx.body = 'successfully saved';
  } catch (error) {
    console.error('Error:', error.message);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }

  await next();
}
