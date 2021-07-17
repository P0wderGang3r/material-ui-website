import Link from 'next/link'
import style_cat from '/styles/catalogue/style_catalogue.module.sass'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Layout_start from '/components/layout_start_page'
import Layout_cat from '/components/layout_catalogue'
import Layout_ucab from '/components/layout_ucab'
import Layout_admrm from '/components/layout_admrm'
import P404 from '/pages/404'

import Cookies from 'js-cookie'

export default function layout_all({children}) {

  switch(children) {
    case 0: return (
      <Layout_start>

      </Layout_start>
    )
    break

    case 1: return (
      <Layout_cat>

      </Layout_cat>
    )
    break

    case 2: return (
      <Layout_ucab>

      </Layout_ucab>
    )
    break

    case 3: return (
      <Layout_admrm>

      </Layout_admrm>
    )
    break

    default: return (
      <P404>

      </P404>
    )
    break
  }
}
