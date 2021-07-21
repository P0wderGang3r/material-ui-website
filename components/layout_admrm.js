import { DataGrid } from '@material-ui/data-grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Router from 'next/router'
import Cookies from 'js-cookie'

import React, { useState, useEffect } from 'react'

const DBTable = require('/locales/DBTables.json')

let dbnum
let columns = []
let numOfTable

function nullifyCategories() {
  Cookies.set('category_id', '')
  Cookies.set('sortBy', '')
}

function reParseDB(dbnum) {
  try {
  fillColumns(parseJSON(dbnum))
  return MyComponent(dbnum)
  } catch(error){

}
}

function parseJSON(num) {
  switch (num) {
    case '1': return DBTable.category
    case '2': return DBTable.checklist
    case '3': return DBTable.delivery
    case '4': return DBTable.delivery_address
    case '5': return DBTable.product
    case '6': return DBTable.product_article
    case '7': return DBTable.purchase
    case '8': return DBTable.storage
    case '9': return DBTable.user_profiles
    default: return <div></div>
  }
}

function fillColumns(dbTable) {
    columns = [
        {
          field: dbTable.field1,
          flex: true
        },
        {
          field: dbTable.field2,
          flex: true
        },
        {
          field: dbTable.field3,
          flex: true
        },
        {
          field: dbTable.field4,
          flex: true
        },
        {
          field: dbTable.field5,
          flex: true
        },
        {
          field: dbTable.field6,
          flex: true
        }
      ]
}

function MyComponent(dbnum) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/show/${dbnum}?username=${Cookies.get('login')}&password=${Cookies.get('password')}`, {
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
    return <div>Ошибка: {error.message}</div>;
  } else if (!isLoaded) {
    return <LinearProgress style = {{position: "absolute", left: 0, right: 0, margin: 400}}/>;
  } else {
    return (
      <div style = {{position: "absolute", left: 0, right: 0, top: 80, bottom: 0}}>
        <DataGrid rows = {items} columns = {columns} checkboxSelection/>
      </div>
    );
  }
}


export default function layout_admrm({children}) {

    //rows = fillFields();
    return (
      <div>
        {nullifyCategories()}
        <TextField label = "Номер таблицы" InputLabelProps={{ shrink: true }} id="inp-field" variant="outlined" style = {{width: 200, marginLeft: 50, marginRight: 50, marginTop: 10}}
          onChange = {() => { Cookies.set('Table_num', event.target.value); window.location.reload(); }}/>
          {fillColumns(parseJSON(Cookies.get('Table_num')))}
          {MyComponent(Cookies.get('Table_num'))}
      </div>
    )
}
