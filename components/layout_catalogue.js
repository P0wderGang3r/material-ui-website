import style_cat from '/styles/catalogue/style_catalogue.module.sass'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import React, { useState, useEffect } from 'react'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'

import Cookies from 'js-cookie'

import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import CloseIcon from '@material-ui/icons/Close'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const locale_ru = require('/locales/locale-ru.json')

//-----------------Основные компоненты каталога------------------

function nullifyCategories() {
  Cookies.set('time', '')
  Cookies.set('city', '')
  Cookies.set('street', '')
  Cookies.set('building', '')
  Cookies.set('email', '')
}

function chooseElements(items, category) {
  let cat_items = []
  let j = 0
  if (category != '' && category != undefined)
    for (let i = 0; i < items.length; i++) {
      if (items[i]['category_id'] == category) {
        cat_items[j] = items[i]
        j++
      }
    }
  else {
    return items
  }
  return cat_items
}

function selectSortByType(items, inp) {
  let typeOf
  let key
  if (inp == ''){ typeOf = "title"; key = 0; }
  if (inp == '0'){ typeOf = "title"; key = 0; }
  if (inp == '1'){ typeOf = "title"; key = 1; }
  if (inp == '2'){ typeOf = "price"; key = 0; }
  if (inp == '3'){ typeOf = "price"; key = 1; }

  console.log(inp)
  console.log(typeOf)
  console.log(key)

  return sortElements(items, typeOf, key)
}

function sortElements(items, typeOf, key) {
    let jmax = 0
    let buf = 0
    for (let i = 0; i < items.length; i++) {
        jmax = i
        for (let j = i; j < items.length; j++) {
            if (key == 1) {
                if (items[jmax][typeOf] < items[j][typeOf])
                    jmax = j;
            }
            if (key == 0) {
                if (items[jmax][typeOf] > items[j][typeOf])
                    jmax = j;
            }
        }
        buf = items[i];
        items[i] = items[jmax];
        items[jmax] = buf;
    }

  console.log(items)

  return items
}

function setToZeroNumToBuy(id){
  Cookies.set(`numToBuy_${id}`, '')
}

//-------------------Функции рисования каталога-----------------

function DrawSelectors(locale) {
  const [sortBy, setSortBy] = React.useState(0);
  const [category, setCategory] = React.useState(0);

  const handleSortBySwitch = (event) => {
    setSortBy(event.target.value)

    if (event.target.value == 0)
      Cookies.set('sortBy', '')
    else
      Cookies.set('sortBy', event.target.value)

  }

  const handleCategorySwitch = (event) => {
    setCategory(event.target.value)

    if (event.target.value == 0)
      Cookies.set('category_id', '')
    else
      Cookies.set('category_id', event.target.value)

  }

  return (
    <Card className={style_cat.cat_selectors}>
      <h1>Фильтры:</h1>

      <FormControl style = {{minWidth: 200, height: 40}}>
        <InputLabel id="cat_input_label_sort">Сортировка по:</InputLabel>
        <Select
          labelId="cat_input_label_sort"
          id="cat_input_sort"
          value={sortBy}
          onChange={handleSortBySwitch}
        >
          <MenuItem value="" disabled>
            <em>{locale.text_sortBy[0]['text']}</em>
          </MenuItem>
          <MenuItem value={0}>{locale.text_sortBy[1]['text']}</MenuItem>
          <MenuItem value={1}>{locale.text_sortBy[2]['text']}</MenuItem>
          <MenuItem value={2}>{locale.text_sortBy[3]['text']}</MenuItem>
          <MenuItem value={3}>{locale.text_sortBy[4]['text']}</MenuItem>
        </Select>
      </FormControl>

      <FormControl style = {{minWidth: 200, height: 40}}>
        <InputLabel id="cat_input_label">Категория товаров</InputLabel>
        <Select
          labelId="cat_input_label"
          id="cat_input"
          value={category}
          onChange={handleCategorySwitch}
        >
          <MenuItem value="" disabled>
            <em>{locale.text_categories[0]['text']}</em>
          </MenuItem>
          <MenuItem value={0}>{locale.text_categories[1]['text']}</MenuItem>
          <MenuItem value={1}>{locale.text_categories[2]['text']}</MenuItem>
          <MenuItem value={2}>{locale.text_categories[3]['text']}</MenuItem>
          <MenuItem value={3}>{locale.text_categories[4]['text']}</MenuItem>
          <MenuItem value={4}>{locale.text_categories[5]['text']}</MenuItem>
          <MenuItem value={5}>{locale.text_categories[6]['text']}</MenuItem>
        </Select>
      </FormControl>
    </Card>
  )
}

function DrawAllElems(card_act_area_height, locale) {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [items, setItems] = useState([])
  //массив [expanded, setExpanded] элементов


  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch(`http://localhost:8000/api/products`, {
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
    let cat_items = chooseElements(items, Cookies.get('category_id'))
    cat_items = selectSortByType(cat_items, Cookies.get('sortBy'))

    return (
      <div className = {style_cat.cat_content}>
        <Grid container justify="center" spacing={3}>
          {cat_items.map((item) => (

            <Grid key={item.id} item>
              {setToZeroNumToBuy(item.id)}

              <Card className={style_cat.outer_block_style}>

                <CardActionArea id = {`card_${item.id}`} style = {{height: card_act_area_height, overflow: "hidden"}} title = {`Подробнее о ${item.title}`} disabled>
                  <CardMedia
                    className={style_cat.picture_block_style}
                    image = {item.picture_link}
                    title = {item.title}
                    style = {{}}
                  />

                  <CardContent>

                    <Typography gutterBottom variant="h5" component="h2">
                      {item.title}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" component="p" className = {style_cat.text_block_style}>
                      {item.short_description}
                    </Typography>

                  </CardContent>

                </CardActionArea>

                <CardActions>

                  <TextField
                    margin="dense"
                    id="textField"
                    label={locale.text_catalogue[0][`text`]}
                    type="number"
                    variant="outlined"
                    onChange = {() => {Cookies.set(`numToBuy_${item.id}`, event.target.value);}}
                  />

                  <IconButton color="default" aria-label="add to shopping cart"
                    title={`${locale.text_catalogue[1][`text`]}: ${item.price} rub`}
                    onClick={() => {
                      if (Cookies.get('login') != "" && Cookies.get('login') != undefined)
                        if (Cookies.get(`numToBuy_${item.id}`) > 0) {
                          alert(locale.text_catalogue_messages[0][`text`])
                          fetch(`http://localhost:8000/api/cart/add?username=${Cookies.get('login')}&password=${Cookies.get('password')}&product_article_id=${item.id}&purchase_amount=${Cookies.get(`numToBuy_${item.id}`)}`,
                          {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                          })
                        }
                        else {
                          alert(locale.text_catalogue_messages[1][`text`])
                        }
                      else {
                        alert(locale.text_catalogue_messages[2][`text`])
                      }
                    }
                  }>
                    <AddShoppingCartIcon />
                  </IconButton>

                </CardActions>
              </Card>

            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default function layout_catalogue({children}) {
  let locale_pack = 0
  let locale

  if (locale_pack == 0){
    locale = locale_ru
  }
  else {
    locale = locale_ru
  }

  let card_act_area_height = 385

  return (
    <div className = {style_cat.wrapper}>
      {nullifyCategories()}
      {DrawSelectors(locale)}
      {DrawAllElems(card_act_area_height, locale)}
    </div>
  )
}
