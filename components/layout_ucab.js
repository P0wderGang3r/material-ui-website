import style_ucab from '/styles/ucab/style_ucab.module.sass'

import { DataGrid } from '@material-ui/data-grid'
import LinearProgress from '@material-ui/core/LinearProgress'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import CancelButton from '@material-ui/icons/Close'
import DeLoginButton from '@material-ui/icons/HighlightOff'

import Cookies from 'js-cookie'

import React, { useState, useEffect } from 'react'

const ucab_fields = require('/locales/ucab-fields.json')
const locale_ru = require('/locales/locale-ru.json')

//document.getElementById('target').innerHTML = "кекст"

//-------------------------Заголовки таблиц----------------------------

function parseJSON(json, num) {
  switch (num) {
    case 0: return json.shipment
    case 1: return json.cart
  }
}

function column_shipment(fields, locale) {
  return [
    { field: fields.field1, headerName: locale.field1, type: 'number', width: 70, sortable: false },
    { field: fields.field2, headerName: locale.field2, width: 190 },
    {
      field: fields.field3,
      headerName: locale.field3,
      width: 160,
      sortable: false
    },
    {
      field: fields.field4,
      headerName: locale.field4,
      width: 160,
    },
    {
      field: fields.field5,
      headerName: locale.field5,
      flex: true,
    },
    {
      field: fields.field6,
      headerName: locale.field6,
      flex: 0.8
    },
  ];
}

function column_cart(fields, locale) {
  return [
    { field: fields.field1, headerName: '№', type: locale.field1, width: 70, sortable: false },
    { field: fields.field2, headerName: locale.field2, flex: true },
    {
      field: fields.field3,
      headerName: locale.field3,
      type: 'number',
      flex: 0.5,
      sortable: false
    },
    {
      field: fields.field4,
      headerName: locale.field4,
      type: 'number',
      flex: 0.5,
      sortable: false
    }
  ]
}

//----------------------Асинхронные операции---------------------------

function MyComponent(dbnum, columns, fetchPath) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch(fetchPath, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div></div>;
  } else if (!isLoaded) {
    return <LinearProgress style = {{margin: 10, marginTop: 30}}/>;
  } else {
    if (dbnum == 0)
      return (
        <div className = {style_ucab.ucab_inner}>
          <DataGrid rows={items} columns={columns}/>
        </div>
      )
    else
      return (
        <div className = {style_ucab.ucab_inner}>
          <DataGrid rows={items} columns={columns}/>
        </div>
      )
  }
}

function checkUser(username, password, locale) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch(`http://localhost:8000/api/users/auth?username=${username}&password=${password}`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return FormDialog(locale);
  } else if (!isLoaded) {
    return (
      <div />
    );
  } else {
    if (items == false)
      return FormDialog(locale)
    else return <div />
  }
}

//-----------------Функции синхронного отображения---------------------

function FormDialog(locale) {

  const addNewUser = () => {
      fetch(`http://localhost:8000/api/users/add?username=${Cookies.get('login')}&password=${Cookies.get('password')}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
    })
  }

  const login = () => {
    window.location.reload()
  }

  const cancel = () => {
    Cookies.set('login', '')
    Cookies.set('password', '')
    window.location.reload()
  }

  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title" id = "target_login">
        <DialogTitle id="form-dialog-title">Вход в учетную запись</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Для использования функционала личного кабинета вам необходимо войти в учетную запись пользователя.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Логин"
            type="email"
            fullWidth
            onChange = {() => {Cookies.set('login', event.target.value);}}
          />
          <TextField
            margin="dense"
            id="pass"
            label="Пароль"
            type="password"
            fullWidth
            onChange = {() => {Cookies.set('password', event.target.value);}}
          />
        </DialogContent>
        <DialogActions style = {{justifyContent: "flex-start", marginLeft: 15, marginTop: 5, marginBottom: 10}}>
        <ButtonGroup variant="text" aria-label="some buttons" size = "large" >
          <Button onClick={cancel} color="secondary" variant="outlined">
            <CancelButton />
          </Button>
          <Button onClick={addNewUser} color="default" variant="outlined">
            Зарегистрироваться
          </Button>
          <Button onClick={login} color="primary" variant="outlined">
            Войти
          </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function main_content(locale, dbTable_ship, dbTable_cart) {

  const [isOpened, setIsOpened] = useState(false)

  const submit = () => {
    fetch(`http://localhost:8000/api/cart/submit?username=${Cookies.get('login')}&password=${Cookies.get('password')}&street=${Cookies.get('street')}&building=${Cookies.get('building')}&city=${Cookies.get('city')}&date_time=${Cookies.get('time')}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
    })
    if (Cookies.get('time') != '' && Cookies.get('city') != '' && Cookies.get('street') != '' && Cookies.get('building') != '')
      alert('Заказ успешно оформлен!')
    else {
      alert('В одном из полей ввода была допущена ошибка')
    }

    Cookies.set('time', '')
    Cookies.set('city', '')
    Cookies.set('street', '')
    Cookies.set('building', '')

    window.location.reload()
  }

  const openOrClose = () => {
    setIsOpened(!isOpened)
  }

  const clearCart = () => {
    fetch(`http://localhost:8000/api/cart/clear?username=${Cookies.get('login')}&password=${Cookies.get('password')}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
    })

    alert('Корзина успешно очищена!');
    window.location.reload();
  }

  return (
    <div className = {style_ucab.ucab_content}>
      <Dialog open={isOpened} aria-labelledby="form-dialog-title" id = "target_login">
        <DialogTitle id="form-dialog-title">{locale.text_ucab_submit[0][`text`]}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {locale.text_ucab_submit[1][`text`]}
          </DialogContentText>
          <TextField
            margin="dense"
            id="time"
            type="date"
            fullWidth
            onChange = {() => {Cookies.set('time', event.target.value);}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="city"
            label={locale.text_ucab_submit[4][`text`]}
            type="text"
            fullWidth
            onChange = {() => {Cookies.set('city', event.target.value);}}
          />
          <TextField
            margin="dense"
            id="street"
            label={locale.text_ucab_submit[5][`text`]}
            type="text"
            fullWidth
            onChange = {() => {Cookies.set('street', event.target.value);}}
          />
          <TextField
            margin="dense"
            id="building"
            label={locale.text_ucab_submit[6][`text`]}
            type="text"
            fullWidth
            onChange = {() => {Cookies.set('building', event.target.value);}}
          />
        </DialogContent>
        <DialogActions style = {{justifyContent: "flex-start", marginLeft: 15, marginTop: 5, marginBottom: 10}}>
        <ButtonGroup variant="text" aria-label="some buttons" size = "large" >
          <Button onClick={submit} color="primary" variant="outlined">
            {locale.text_ucab_submit[2][`text`]}
          </Button>
          <Button onClick={openOrClose} color="secondary" variant="outlined">
            <CancelButton />
          </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>

      <div className = {style_ucab.ucab_outer_shipment}>

        <div className = {style_ucab.ucab_header}>
          {locale.text_ucab[0][`text`]}
        </div>

        {MyComponent(0, dbTable_ship, `http://localhost:8000/api/deliveries/show/detailed?username=${Cookies.get('login')}&password=${Cookies.get('password')}`)}
      </div>

      <div className = {style_ucab.ucab_outer_cart}>
        <div className = {style_ucab.ucab_header}>
          {locale.text_ucab[1][`text`]}
        </div>

        {MyComponent(1, dbTable_cart, `http://localhost:8000/api/cart/show?username=${Cookies.get('login')}&password=${Cookies.get('password')}`)}

        <ButtonGroup variant="text" color = "primary" size="large" aria-label="some buttons" variant = "outlined" style = {{left: 0, marginTop: 20}}>
          <Button onClick = {openOrClose} color="primary">{locale.text_ucab[2][`text`]}</Button>
          <Button onClick = {clearCart} color="secondary">{locale.text_ucab[3][`text`]}</Button>
        </ButtonGroup>

      </div>

      <Button className = {style_ucab.ucab_button} size = "large" color = "primary" style = {{position: "absolute", right: 0, bottom: 0}} variant = "outlined"
        onClick = {() => { Cookies.set('login', ''); Cookies.set('password', ''); window.location.reload(); }}>
          <DeLoginButton fontSize = "large" style = {{marginRight: 4, marginLeft: -2}}/>{locale.text_ucab[4][`text`]}
      </Button>

    </div>
  )
}

function login_content(locale) {
  return (
    <div>
      {checkUser(Cookies.get('login'), Cookies.get('password'), locale)}
    </div>
  )
}

//-----------------------Основные операции-----------------------------

export default function layout_ucab({children}) {
  let locale_pack = 0
  let locale

  if (locale_pack == 0){
    locale = locale_ru
  }
  else {
    locale = locale_ru
  }

  let dbTable_ship = column_shipment(parseJSON(ucab_fields, 0), parseJSON(locale, 0))
  let dbTable_cart = column_cart(parseJSON(ucab_fields, 1), parseJSON(locale, 1))

  return (
    <div className = {style_ucab.ucab_content} id = "target">
      {Cookies.get('login') != "" ? Cookies.get('login') != undefined ? main_content(locale, dbTable_ship, dbTable_cart): <div></div> : <div></div>}

      {login_content(locale)}
    </div>
  )
}
