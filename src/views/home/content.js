import React, {Component} from 'react'
import moment from 'moment'
import {
  Card,
  Row,
  Col,
  Badge,
  Icon,
} from 'antd'
import 'moment/locale/zh-cn'
import { Link } from 'react-router-dom'

const site = 'http://p8htsdgzm.bkt.clouddn.com/'
const Meta = Card.Meta

moment.locale('zh-cn')



export default class Content extends Component {

  _renderContent () {
    const {movies} = this.props

    return (
      <div style={{padding: 20}}>
        <Row>
          {
            movies.map((item, index) => {
              return (
                <Col key={index}
                     xl={{span: 6}}
                     lg={{span: 8}}
                     md={{span: 12}}
                     sm={{span: 24}}
                     style={{marginBottom: 8}}
                >
                  <Card bordered={false}
                        hoverable
                        style={{width: '90%', margin: '0 5px'}}
                        actions={[
                          <Badge>
                            <Icon style={{marginRight: 2}} type='clock-circle' />
                              {moment(item.meta.createdAt).fromNow(true)}前更新
                          </Badge>,
                          <Badge>
                            <Icon style={{marginRight: 2}} type='star' />
                              {item.rate}分
                          </Badge>
                        ]}
                        cover={<img src={site + item.posterKey + '?imageMogr2/thumbnail/1080x1600!'}/>}
                  >
                    <Meta style={{height: 202, overflow: 'hidden'}}
                          title={<Link to={`/detail/${item._id}`}>{item.title}</Link>}
                          description={<Link to={`/detail/${item._id}`}>{item.summary}</Link>}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    )
  }

  render () {
    return (
      <div style={{ padding: 10 }}>
        {this._renderContent()}
      </div>
    )
  }

}