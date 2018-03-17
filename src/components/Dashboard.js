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

const Dashboard = (props: any) => {
  const { classes, models, user } = props
  return (
    <Body>
      <Header title={<Trans>cms.dashboard</Trans>}>
        <IconButton component={Link} to={`/user`} color={'inherit'}>
          <UserIcon />
        </IconButton>
      </Header>
      <Content>
        <CardHeader
          avatar={<Avatar aria-label={<Trans>cms.dashboard</Trans>}>{'D'}</Avatar>}
          title={<Trans id='cms.welcome'>Welcome {user.username}</Trans>}
        />
        <List className={classes.drawerList} component={'nav'}>
          {models.map(model => (
            <ListItem
              className={classes.drawerListItem}
              key={model.name}
              component={NavLink}
              to={`/${model.name}`}
              button
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans id={model.label} />} />
            </ListItem>
          ))}
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
