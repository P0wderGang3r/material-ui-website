import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import Cookies from 'js-cookie'

const locale_ru = require('/locales/locale-ru.json')

function nullifyCategories() {
  Cookies.set('category_id', '')
  Cookies.set('sortBy', '')

  Cookies.set('time', '')
  Cookies.set('city', '')
  Cookies.set('street', '')
  Cookies.set('building', '')
  Cookies.set('email', '')
}

export default function layout_start_page({children}) {
  let locale_pack = 0
  let locale

  if (locale_pack == 0){
    locale = locale_ru
  }
  else {
    locale = locale_ru
  }

  return (
    <div style = {{margin: 20}}>
      {nullifyCategories()}
      <h1>{locale.text_start_page[0][`text`]}</h1>
      <div>{locale.text_start_page[1][`text`]}</div>
      <div>{locale.text_start_page[2][`text`]}</div>
      <div>{locale.text_start_page[3][`text`]}</div>
      <div>{locale.text_start_page[4][`text`]}</div>
      <div>{locale.text_start_page[5][`text`]}</div>
      <ButtonGroup variant="text" color = "primary" size="large" aria-label="some buttons" variant = "outlined" style = {{left: 0, marginTop: 20}}>
        <Button title = "Русский язык"
          onClick = {() => { alert('Язык успешно изменен на русский!'); window.location.reload(); }} color="primary">{locale.text_start_page[6][`text`]}</Button>
        <Button title = "Английский язык"
          onClick = {() => { alert('Язык успешно изменен на английский!'); window.location.reload(); }} color="primary" disabled>{locale.text_start_page[7][`text`]}</Button>
      </ButtonGroup>
    </div>
  )
}
