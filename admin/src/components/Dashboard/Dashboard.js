// @flow

import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InboxIcon from 'material-ui-icons/Inbox'
import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import UserIcon from 'material-ui-icons/Person'
import { Body, Header, Content } from 'components/ux'

import { Models } from 'components/Preset'

const Dashboard = (props: any) => {
  const { classes, user } = props
  const itemProps = {
    className: classes.drawerListItem,
    component: NavLink,
    button: true,
  }
  return (
    <Body>
      <Header title={<Trans>Dashboard</Trans>}>
        <IconButton component={Link} to={`/user`} color={'inherit'}>
          <UserIcon />
        </IconButton>
      </Header>
      <Content>
        <CardHeader
          avatar={<Avatar aria-label={<Trans>Dashboard</Trans>}>{'D'}</Avatar>}
          title={<Trans>Welcome {user.username}</Trans>}
        />
        <List className={classes.drawerList} component={'nav'}>
          <Models>
            {({ error, loading, models }) => 
              models.map(model => (
                <ListItem key={model.name} to={`/model/${model.name}`} {...itemProps}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Trans id={`${model.name}_plural`} />}
                  />
                </ListItem>
              ))
            }
          </Models>
        </List>
      </Content>
    </Body>
  )
}

const styles = theme => ({
  drawer: {
    width: theme.drawer.width,
  },
  drawerPaper: {
    width: theme.drawer.width,
  },
  drawerTitle: {
    ...theme.typography.title,
    color: '#000',
    textDecoration: 'none',
  },
  drawerToolbar: {
    padding: `0 ${theme.spacing.unit * 3}px`,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  drawerList: {
    flex: '0 1 auto',
  },
  drawerListItem: {
    paddingLeft: theme.spacing.unit * 3,
    '& svg': {
      marginRight: 0,
    },
  },
})

export default withStyles(styles)(Dashboard)
