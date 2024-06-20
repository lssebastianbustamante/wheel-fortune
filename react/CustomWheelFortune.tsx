/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import type { Segment } from './components/CustomArredoWheelFortune/WheelOfFortune'
import Wheel from './components/CustomArredoWheelFortune/WheelOfFortune'

interface CustomWheelFortuneProps {
  popupActive: boolean
  segments: Segment[]
  imageSrc: string
  formImg: string
  titleText: string
  formParagraph: string
  formBtnSubmit: string
  basesConditionsParagraph: string
  basesConditionsLink: string
  cancelSuscription: string
  isRegisteredTitle: string
  isRegisteredDinamic: string
  isRegisteredParagraph: string
  variableLocalStorage: string
}

const DELAY = 2
const CSS_HANDLES = [
  'modalWrapper',
  'modalOverlay',
  'wheelWrapperActive',
  'wheelWrapperInactive',
  'closeModalButton',
]

const CustomWheelFortune: StorefrontFunctionComponent<CustomWheelFortuneProps> = ({
  popupActive,
  segments,
  imageSrc,
  formImg,
  titleText,
  formParagraph,
  formBtnSubmit,
  basesConditionsParagraph,
  basesConditionsLink,
  cancelSuscription,
  isRegisteredTitle,
  isRegisteredDinamic,
  isRegisteredParagraph,
  variableLocalStorage,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const handleResult = (selectedSegment: Segment) => {
    console.log('Premio seleccionado:', selectedSegment)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal: any = () => {
    localStorage.setItem(variableLocalStorage, '1')
    setIsModalOpen(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false)
    }
  }

  const showUpByLocalStorage = () => {
    if (typeof Storage === 'undefined') {
      return false
    }

    if (localStorage.getItem(variableLocalStorage)) {
      return false
    }

    return true
  }

  useEffect(() => {
    let timer: any = false

    if (canUseDOM && showUpByLocalStorage()) {
      timer = setTimeout(() => {
        setIsModalOpen(true)
      }, DELAY * 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [canUseDOM])

  return popupActive && isModalOpen ? (
    <>
      <div
        role="presentation"
        onClick={() => handleCloseModal()}
        onKeyUp={handleKeyUp}
        className={`${handles.modalOverlay} ${
          isModalOpen
            ? handles.wheelWrapperActive
            : handles.wheelWrapperInactive
        }`}
      />
      <div
        className={`${handles.modalWrapper} ${
          isModalOpen
            ? handles.wheelWrapperActive
            : handles.wheelWrapperInactive
        }`}
      >
        <div
          role="presentation"
          onClick={() => handleCloseModal()}
          onKeyUp={handleKeyUp}
          className={`${handles.closeModalButton}`}
        >
          x
        </div>
        <Wheel
          segments={segments}
          width={400}
          onResult={handleResult}
          imageSrc={imageSrc}
          formImg={formImg}
          titleText={titleText}
          formParagraph={formParagraph}
          formBtnSubmit={formBtnSubmit}
          basesConditionsParagraph={basesConditionsParagraph}
          basesConditionsLink={basesConditionsLink}
          cancelSuscription={cancelSuscription}
          setIsModalOpen={setIsModalOpen}
          isRegisteredTitle={isRegisteredTitle}
          isRegisteredDinamic={isRegisteredDinamic}
          isRegisteredParagraph={isRegisteredParagraph}
          variableLocalStorage={variableLocalStorage}
        />
      </div>
    </>
  ) : null
}

CustomWheelFortune.schema = {
  title: 'Custom Wheel of Fortune',
  description:
    'A custom Wheel of Fortune component that can be edited in Site Editor',
  type: 'object',
  properties: {
    popupActive: {
      title: 'Activo',
      description: 'Está activo el modal.',
      type: 'boolean',
      default: false,
    },
    variableLocalStorage: {
      title: 'Variable Local Storage',
      type: 'string',
      description: 'Variable donde se guardara si el usuario jugo',
      default: 'wheel'
    },
    imageSrc: {
      title: 'Image Wheel of Fortune',
      description: 'A image that can be edited in Site Editor',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
      default: 'https://placehold.co/95x95',
    },
    segments: {
      title: 'Segments',
      type: 'array',
      items: {
        title: 'Segment',
        type: 'object',
        properties: {
          text: {
            title: 'Texto ruleta',
            type: 'string',
            widget: { 'ui:widget': 'textarea' },
          },
          textWinner: {
            title: 'Texto ganador',
            type: 'string',
          },
          colorSegment: {
            title: 'Color Segment',
            type: 'string',
          },
          colorText: {
            title: 'Color Text',
            type: 'string',
          },
          prize: {
            title: 'Prize',
            type: 'string',
          },
          cupon: {
            title: 'Cupon',
            type: 'string',
          },
          voucherCondition: {
            title: 'Voucher Condition',
            type: 'string',
          },
          prizeValid: {
            title: 'Prize Valid',
            type: 'string',
            widget: { 'ui:widget': 'textarea' },
          },
          prizeConditions: {
            title: 'Prize Conditions',
            type: 'string',
            widget: { 'ui:widget': 'textarea' },
          }
        },
      },
      minItems: 1,
      default: [
        {
          text: 'ENVÍO GRATIS',
          textWinner: 'ENVÍO GRATIS',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'envioGratis',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra',
        },
        {
          text: 'VOUCHER $1000',
          textWinner: 'VOUCHER DE $1000',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'voucher1000',
          cupon: '',
          voucherCondition: 'PARA COMPRAS SUPERIORES A $8000',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: 'ENVÍO GRATIS',
          textWinner: 'ENVÍO GRATIS',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'envioGratis',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: '5% EXTRA',
          textWinner: '5% EXTRA',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: '5-offExtra',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: '10% EXTRA',
          textWinner: '10% EXTRA',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: '10-offExtra',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: 'ENVÍO GRATIS',
          textWinner: 'ENVÍO GRATIS',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'envioGratis',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: 'ENVÍO GRATIS',
          textWinner: 'ENVÍO GRATIS',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'envioGratis',
          cupon: '',
          voucherCondition: '',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
        {
          text: 'VOUCHER $2000',
          textWinner: 'VOUCHER DE $2000',
          colorSegment: '#fb5226',
          colorText: '#fff',
          prize: 'voucher2000',
          cupon: '',
          voucherCondition: 'PARA COMPRAS SUPERIORES A $15000',
          prizeValid: '*Válido para compras realizadas entre',
          prizeConditions: 'Antes de finalizar tu compra ',
        },
      ],
    },
    formImg: {
      title: 'Image Banner',
      description: 'A image that can be edited in Site Editor',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
      default: 'https://placehold.co/416x138',
    },
    titleText: {
      title: 'Title Text',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: '¡Dejanos tu mail y jugá por grandes premios!',
    },
    formParagraph: {
      title: 'Form Paragraph',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default:
        'A este mail, también, van a llegarte todos los descuentos y novedades del Hot Sale, para que los disfrutes antes que nadie.',
    },
    formBtnSubmit: {
      title: 'Form Button Submit',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: 'HACÉ GIRAR TU SUERTE AHORA',
    },
    basesConditionsParagraph: {
      title: 'Bases Conditions Paragraph',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: 'Ver bases y condiciones en',
    },
    basesConditionsLink: {
      title: 'Bases Conditions Link',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: '',
    },
    cancelSuscription: {
      title: 'Cancel Suscription',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: 'HACÉ CLICK ACÁ SI QUERÉS IRTE SIN PARTICIPAR',
    },
    isRegisteredTitle: {
      title: 'Is Registered Title',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: 'Como hay más personas esperando en la fila, solo se puede participar una vez',
    },
    isRegisteredDinamic: {
      title: 'Is Registered Dinamic',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: '¡Gracias por haber hecho girar la ruleta!',
    },
    isRegisteredParagraph: {
      title: 'Is Registered Paragraph',
      description: 'A text that can be edited in Site Editor',
      type: 'string',
      default: "No te pierdas nada del Hot Sale"
    }
     
  }
}

export default CustomWheelFortune
