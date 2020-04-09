import React from 'react'
import RJSForm from 'react-jsonschema-form'
import css from './css'
import classnames from 'classnames'

const noop = (formData) => formData
const uiSchema = {}

export default class Form extends React.Component {
  state = {}
  onSubmit = ({ formData }) => {
    const { prepData = noop, onSubmit = noop, onSuccess = noop } = this.props
    try {
      formData = prepData(formData)
      Promise.resolve(onSubmit(formData)).then(onSuccess).catch(this.setError)
    } catch (error) {
      this.setError(error)
    }
  }

  setError = (error) => {
    this.setState({
      error: error || 'An unknown error has occurred',
      loading: false,
    })
    throw error
  }

  isValid = () => {
    if (this.props.error || this.state.error) {
      return false
    }
    const required = this.props.schema.required || []
    const { formData } = this.state
    return !required.find((fieldName) => !formData[fieldName])
  }

  render() {
    const {
      cancel,
      cancelText = 'Cancel',
      children,
      customButton,
      className,
      title,
      schema,
      submitText = 'Submit',
      success,
      after,
    } = this.props
    const error = this.state.error || this.props.error
    const loading = this.state.loading || this.props.loading
    return (
      <div
        className={classnames('rjsf', className, { 'loading-locked': loading })}
      >
        {title && <div className={css.h2}>{title}</div>}
        <RJSForm
          onSubmit={this.onSubmit}
          schema={schema}
          uiSchema={{
            ...uiSchema,
            ...this.props.uiSchema,
          }}
        >
          {children}
          {error && <div className={css.alert.error}>{error}</div>}
          {success && <div className={css.alerts.success}>{success}</div>}
          {!customButton && (
            <div className="flex justify-end mb-8">
              {cancel && (
                <div className={css.button.none} onClick={cancel}>
                  {cancelText}
                </div>
              )}
              <button
                className={css.button({disabled: !this.isValid()})}
              >
                {submitText}
              </button>
            </div>
          )}
          {after}
        </RJSForm>
      </div>
    )
  }
}
