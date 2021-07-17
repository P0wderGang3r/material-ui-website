import { DataGrid } from '@material-ui/data-grid'

import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

export default function layout_start_page({children}) {

  return (
    <div style = {{margin: 20}}>
      <h1>Здравствуйте, уважаемый посетитель!</h1>
      <div>Вы находитесь на сайте-каталоге строительных товаров.</div>
      <div>Для выбора товара перейдите на страницу "Каталог", указанную выше.</div>
      <div>Для добавления товаров в корзину для начала потребуется войти от имени учетной записи пользователя.</div>
      <div>Войти в свою учетную запись пользователя или зарегистрировать новую вы можете на странице "Личный кабинет", указанной выше.</div>
      <div>Для изменения языка, используемого данным сайтом, нажмите по одной из предложенных кнопок ниже.</div>
      <ButtonGroup variant="text" color = "primary" size="large" aria-label="some buttons" variant = "outlined" style = {{left: 0, marginTop: 20}}>
        <Button title = "Русский язык"
          onClick = {() => { alert('Язык успешно изменен на русский!'); window.location.reload(); }} color="primary">Русский язык</Button>
        <Button title = "Английский язык"
          onClick = {() => { alert('Язык успешно изменен на английский!'); window.location.reload(); }} color="primary">Английский язык</Button>
      </ButtonGroup>
    </div>
  )
}
