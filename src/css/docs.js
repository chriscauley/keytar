import React from 'react'

import css from './index'
import variants from './variants'

const ButtonShowCase = () => {
  const wrapper_class = 'p-2'
  return (
    <div>
      <div className={css.h3}>Default Buttons</div>
      <div className="flex flex-wrap">
        {variants.map((variant) => (
          <div className={wrapper_class} key={variant}>
            <button className={css.button[variant]()}>{variant}</button>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <div className={css.h3}>Disabled Buttons</div>
      <div className="flex flex-wrap">
        {variants.map((variant) => (
          <div className={wrapper_class} key={variant}>
            <button className={css.button[variant]('disabled')}>
              {variant}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const AlertShowCase = () => {
  return (
    <div>
      <div className={css.h3}>Alerts</div>
      {variants.map((variant) => (
        <div className={css.alert[variant]('mb-4')} key={variant}>
          This is an alert with variant <b>{variant}</b>
        </div>
      ))}
    </div>
  )
}

export default class CSSDetails extends React.Component {
  render() {
    const { outer, mask, content } = css.modal
    return (
      <div className={outer}>
        <a href="#" className={mask}></a>
        <div className={content}>
          <ButtonShowCase />
          <hr className="my-8" />
          <AlertShowCase />
        </div>
      </div>
    )
  }
}
