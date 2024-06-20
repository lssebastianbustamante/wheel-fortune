/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import './WheelOfFortune.css'
import { useCssHandles } from 'vtex.css-handles'

import { calculateSegmentAngle } from '../../helpers/angle'

const CSS_HANDLES = [
  'wheelFortuneWrapper',
  'formWrapper',
  'wheelContainer',
  'wheelWrapper',
  'wheel',
  'spinButton',
  'wheelArrow',
  'wheelText',
  'wheelTextContent',
  'wheelSection',
  'wheelImage',
  'formContent',
  'formTitle',
  'formText',
  'formParagraph',
  'titleText',
  'formContent',
  'formImg',
  'formImgContent',
  'formContainer',
  'formInput',
  'formBtnSubmit',
  'basesConditionsWrapper',
  'basesConditionsContainer',
  'cancelSuscription',
  'basesConditionsParagraph',
  'basesConditionsLink',
  'prizeWrapper',
  'prizeContainer',
  'prizeImg',
  'prizeImgContent',
  'prizeTitle',
  'prizeContent',
  'prizeDinamic',
  'prizeStatic',
  'voucherCondition',
  'prizeValid',
  'prizeConditions',
  'prizeConditionsParagraph',
  'error',
  'isRegisteredWrapper',
  'isRegisteredContainer',
  'isRegistered',
  'isRegisteredParagraph',
  'isRegisteredTitle',
  'isRegisteredContent',
  'isRegisteredDinamic',
  'textClose',
  'countDown',
  'loading',
]

export interface Segment {
  text: string
  textWinner: string
  colorSegment: string
  colorText: string
  prize: string
  cupon: string
  voucherCondition: string
  prizeValid: string
  prizeConditions: string
}

interface WheelProps {
  segments: Segment[]
  width: number
  onResult: (selectedSegment: Segment) => void
  imageSrc: string
  formImg: string
  titleText: string
  formParagraph: string
  formBtnSubmit: string
  basesConditionsParagraph: string
  basesConditionsLink: string
  cancelSuscription: string
  setIsModalOpen: any,
  isRegisteredTitle: string,
  isRegisteredDinamic: string,
  isRegisteredParagraph: string,
  variableLocalStorage: string
}

const Wheel: React.FC<WheelProps> = ({
  segments,
  width,
  onResult,
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
  setIsModalOpen,
  variableLocalStorage,
}) => {
  const [rotation, setRotation] = useState(0)
  const [isPrizeRevealed, setIsPrizeRevealed] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState('')
  const [voucherCondition, setVoucherCondition] = useState('')
  const [prizeValid, setPrizeValid] = useState('')
  const [prizeConditions, setPrizeConditions] = useState('')
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(400)
  const [isLoading, setIsLoading] = useState(false)

  const handles = useCssHandles(CSS_HANDLES)
  const angle = calculateSegmentAngle(segments.length)

  const countDown = useCallback(() => {
    let seconds = timeLeft

    const intervalClose = setInterval(() => {
      setTimeLeft(seconds - 1)
      if (seconds <= 0) {
        setIsModalOpen(false)
        clearInterval(intervalClose)
        localStorage.setItem(variableLocalStorage, '1')
      }

      seconds--
    }, 1000)
  }, [setIsModalOpen, timeLeft])

  const spinWheel = () => {
    const newRotation = rotation + 360 * (2 + Math.random() * 3)

    setIsLoading(true)

    setRotation(newRotation)
  }

  // Email validations
  const validateEmail = (emailParam: string) => {
    // Validación de la dirección de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (emailParam === '') {
      setIsValid(false)
      setEmailError('Debes ingresar el email para participar')

      return
    }

    const valid = emailRegex.test(emailParam)

    if (emailRegex.test(emailParam)) {
      setEmailError('')
    } else {
      setEmailError('Email inválido')
    }

    setIsValid(valid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    validateEmail(e.target.value)
  }
  // End email validations

  const handleClose = () => {
    localStorage.setItem(variableLocalStorage, '1')
    setIsModalOpen(false)
  }

  const savePrize = useCallback(
    async (prize: string, cupon: string) => {
      const dataToSave = {
        email,
        prizesEvent: prize,
        couponEvent: cupon,
      }

      try {
        const response = await fetch(`/wheel-fortune/savePrize`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        })

        const data = await response.json()

        localStorage.setItem(variableLocalStorage, '1')
        console.log('savePrize', data)
      } catch (error) {
        console.error(error)
      }
    },
    [email]
  )

  const handleTransitionEnd = useCallback(() => {
    const selectedSegmentIndex = Math.floor((rotation % 360) / angle)
    const selectedSegment = segments[segments.length - 1 - selectedSegmentIndex]

    onResult(selectedSegment)
    setIsPrizeRevealed(true)
    countDown()
    setIsLoading(false)
  }, [angle, countDown, onResult, rotation, segments])

  const handleCancelSuscription = () => {
    const noParticipationSegment: Segment = {
      text: 'No quiero participar',
      textWinner: 'No quiero participar',
      colorSegment: '',
      colorText: '',
      prize: 'noQuieroParticipar',
      cupon: 'noQuieroParticipar',
      voucherCondition: '',
      prizeValid: '',
      prizeConditions: '',
    }

    onResult(noParticipationSegment)
    setIsPrizeRevealed(true)
    localStorage.setItem(variableLocalStorage, '1')
    setIsModalOpen(false)
  }

  useEffect(() => {
    const wheelElement = document.querySelector(`.${handles.wheel}`)

    if (wheelElement) {
      wheelElement.addEventListener('transitionend', handleTransitionEnd)
    }

    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener('transitionend', handleTransitionEnd)
      }
    }
  }, [handleTransitionEnd, handles.wheel, rotation])

  useEffect(() => {
    if (!isPrizeRevealed) return
    const selectedSegmentIndex: number = Math.floor((rotation % 360) / angle)
    const selectedSegment: Segment =
      segments[segments.length - 1 - selectedSegmentIndex]

    setSelectedPrize(selectedSegment.textWinner)
    savePrize(selectedSegment.prize, selectedSegment.cupon)
    setVoucherCondition(selectedSegment.voucherCondition)
    setPrizeValid(selectedSegment.prizeValid)
    setPrizeConditions(selectedSegment.prizeConditions)
    
  }, [angle, isPrizeRevealed, rotation, savePrize, segments])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    validateEmail(email)
    if (!isValid) return
    try {
      const response = await fetch(
        `/wheel-fortune/searchDocument/${email}`
      )

      const data = await response.json()

      console.log('handleSubmit', data)
      if (
        data.length &&
        data[0].prizesEvent !== null &&
        data[0].prizesEvent !== ''
      ) {
        setIsRegistered(true)
        countDown()
      } else {
        spinWheel()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderPrizeTemplate = () => {
    if (isRegistered) {
      return (
        <div
          className={`${handles.prizeWrapper} ${handles.isRegisteredWrapper} flex justify-center w-50 flex-column items-center`}
        >
          <div className={`${handles.isRegisteredContainer}`}>
            <div className={`${handles.prizeImgContent}`}>
              <img className={`${handles.prizeImg}`} src={formImg} alt="Form" />
            </div>
            <h2 className={`${handles.isRegisteredTitle}`}>
              <ReactMarkdown>{isRegisteredTitle}</ReactMarkdown>
            </h2>
            <div className={`${handles.isRegisteredContent}`}>
              <p className={`${handles.isRegisteredDinamic}`}>
                <ReactMarkdown>{isRegisteredDinamic}</ReactMarkdown>
              </p>
            </div>
            <div className={`${handles.isRegistered}`}>
              <p className={`${handles.isRegisteredParagraph}`}>
                <ReactMarkdown>{isRegisteredParagraph}</ReactMarkdown>
              </p>
            </div>
          </div>
          <p onClick={handleClose} className={`${handles.textClose}`}>
            HACÉ CLICK ACÁ PARA SALIR
          </p>
          <p className={`${handles.countDown}`}>
            Esta ventana se cerrara en {`${timeLeft}`} segundo
            {timeLeft !== 1 ? 's' : null}...
          </p>
        </div>
      )
    }

    return (
      <div
        className={`${handles.prizeWrapper} flex justify-center w-50 flex-column items-center`}
      >
        <div className={`${handles.prizeContainer}`}>
          <div className={`${handles.prizeImgContent}`}>
            <img className={`${handles.prizeImg}`} src={formImg} alt="Form" />
          </div>
          <h2 className={`${handles.prizeTitle}`}>¡GANASTE!</h2>
          <div className={`${handles.prizeContent}`}>
            <p className={`${handles.prizeDinamic}`}>{selectedPrize}!</p>
            <p className={`${handles.prizeStatic}`}>
              {voucherCondition === '' ? 'EN TU PRÓXIMA COMPRA' : voucherCondition}
            </p>
            <p className={`${handles.prizeValid}`}>
              <ReactMarkdown>{prizeValid}</ReactMarkdown>
            </p>
          </div>
        </div>
        <div className={`${handles.prizeConditions}`}>
          <ReactMarkdown className={`${handles.prizeConditionsParagraph}`}>{prizeConditions}</ReactMarkdown>
        </div>
        <p onClick={handleClose} className={`${handles.textClose}`}>
          HACÉ CLICK ACÁ PARA SALIR
        </p>
        <p className={`${handles.countDown}`}>
          Esta ventana se cerrara en {`${timeLeft}`} segundo
          {timeLeft !== 1 ? 's' : null}...
        </p>
      </div>
    )
  }

  return (
    <div
      className={`${handles.wheelFortuneWrapper} ${
        isLoading ? handles.loading : null
      }`}
    >
      <div className={`${handles.wheelContainer} flex-xl`}>
        {isPrizeRevealed || isRegistered ? (
          renderPrizeTemplate()
        ) : (
          <div
            className={`${handles.formWrapper} flex-xl justify-center w-50 flex-column`}
          >
            <div className={`${handles.formImgContent}`}>
              <img className={`${handles.formImg}`} src={formImg} alt="Form" />
            </div>
            <div className={`${handles.formContent} flex-xl flex-column`}>
              <div className={`${handles.formTitle} flex-xl`}>
                <h2 className={`${handles.titleText}`}>{titleText}</h2>
              </div>
              <div className={`${handles.formText} flex-xl`}>
                <p className={`${handles.formParagraph} flex-xl`}>
                  {formParagraph}
                </p>
              </div>
              <div className={`${handles.formContent} flex flex-column`}>
                <form
                  className={`${handles.formContainer} flex flex-column items-center `}
                  onSubmit={handleSubmit}
                >
                  <input
                    className={`${handles.formInput}`}
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Ingresá tu correo electrónico"
                  />
                  {!isValid ? (
                    <div className={`${handles.error}`}>{emailError}</div>
                  ) : null}
                  <button className={`${handles.formBtnSubmit}`} type="submit">
                    {formBtnSubmit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {
          <div className={`${handles.wheelWrapper} flex-xl`}>
            <div
              className={`${handles.wheel}`}
              style={{
                width,
                height: width,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {segments.map((segment, index) => {
                return (
                  <div key={index} className={`${handles.wheelSection}`}>
                    <div
                      className={`${handles.wheelText}`}
                      style={{ background: segment.colorSegment }}
                    >
                      <p
                        className={`${handles.wheelTextContent}`}
                        style={{ color: segment.colorText }}
                        id={segment.prize}
                      >
                        <ReactMarkdown>{segment.text}</ReactMarkdown>
                      </p>
                    </div>
                  </div>
                )
              })}
              <img
                src={imageSrc}
                alt="Wheel center"
                className={`${handles.wheelImage}`}
              />
            </div>
            <div className={`${handles.wheelArrow}`} />
          </div>
        }
      </div>
      <div
        className={`${handles.basesConditionsWrapper} flex flex-column items-center`}
      >
        <div
          className={`${handles.basesConditionsContainer} flex  flex-column items-center`}
        >
          <p className={`${handles.basesConditionsParagraph}`}>
            {basesConditionsParagraph}
          </p>
          <a
            className={`${handles.basesConditionsLink}`}
            target="_blank"
            href={basesConditionsLink}
            rel="noreferrer"
          >
            {basesConditionsLink}
          </a>
        </div>
        <button
          className={`${handles.cancelSuscription}`}
          onClick={handleCancelSuscription}
        >
          {cancelSuscription}
        </button>
      </div>
    </div>
  )
}

export default Wheel
