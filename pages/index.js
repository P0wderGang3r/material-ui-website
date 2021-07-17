import Head from 'next/head'
import Image from 'next/image'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Layout_all from '/components/layout_all'

import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'

import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const locale_ru = require('/locales/locale-ru.json')


function checkUser(username, password, locale) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch(`http://localhost:8000/api/users/authadmin?username=${username}&password=${password}`, {
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
    return <div />
  } else if (!isLoaded) {
    return (
      <div />
    );
  } else {

    if (items == true)
      return <Tab {...tab_Announcement(locale.text_header[3][`text`], 3)}/>
    else return <div />
  }
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Layout_all layout_all>
          {index}
        </Layout_all>
      )}
    </div>
  );
}


function tab_Announcement(label_text, id_text) {
  return {
    label: `${label_text}`,
    id: `tab-${id_text}`,
    'aria-controls': `tabpanel-${id_text}`,
  };
}

export default function Home() {
  let [page, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
      setValue(newValue)
  };

  let locale = locale_ru;

  return (
    <main_content>
      <Head>
        <title>Магазин iKAEYA</title>
        <meta name="Магазин iKAEYA" content="Магазин стройматериалов iKAEYA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Tabs
          aria-label="main_tabs"
          value = {page}
          onChange = {handleChange}
        >
          <Tab icon={<HomeIcon />} {...tab_Announcement(locale.text_header[0][`text`], 0)} />
          <Tab {...tab_Announcement(locale.text_header[1][`text`], 1)} />
          <Tab {...tab_Announcement(locale.text_header[2][`text`], 2)} />
          {checkUser(Cookies.get('login'), Cookies.get('password'), locale)}
          <Tab icon={<SearchIcon />} {...tab_Announcement(locale.text_header[4][`text`], 4)} style = {{position: "absolute", right: 0}} />
        </Tabs>
      </AppBar>


      <article>
        <TabPanel value={page} index={0}>
          Главная
        </TabPanel>
        <TabPanel value={page} index={1}>
          Каталог
        </TabPanel>
        <TabPanel value={page} index={2}>
          Личный кабинет
        </TabPanel>
        <TabPanel value={page} index={3}>
          Админка
        </TabPanel>
        <TabPanel value={page} index={4}>
          Поиск по сайту
        </TabPanel>
      </article>

    </main_content>
  )
}
