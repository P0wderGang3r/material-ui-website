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

const locale_ru = require('/locales/locale-ru.json')

//-----------------Основные компоненты каталога------------------

function setToZeroNumToBuy(id){
  Cookies.set(`numToBuy_${id}`, '')
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

    return (
      <div className = {style_cat.cat_content}>
        <Grid container justify="center" spacing={3}>
          {items.map((item) => (

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
                          alert('Товар успешно добавлен в корзину!')
                          fetch(`http://localhost:8000/api/cart/add?username=${Cookies.get('login')}&password=${Cookies.get('password')}&product_article_id=${item.id}&purchase_amount=${Cookies.get(`numToBuy_${item.id}`)}`,
                          {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                          })
                        }
                        else {
                          alert('Неверно указанное количество товара для добавления в корзину')
                        }
                      else {
                        alert('Для добавления товара в корзину необходимо войти в учетную запись пользователя')
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

  return DrawAllElems(card_act_area_height, locale)
}
