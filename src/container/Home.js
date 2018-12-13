import React from 'react';

import {Row, Col, Card, Timeline, Icon} from 'antd';

//import style from '../assets/css/home.css';


const Home = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col md={6}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="clear y-center">
                                <div className="pull-left mr-m">
                                    <Icon type="heart" className="text-2x text-danger"/>
                                </div>
                                <div className="clear">
                                    <div className="text-muted">患者会诊预约</div>
                                    <h2>122</h2>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="clear y-center">
                                <div className="pull-left mr-m">
                                    <Icon type="star-o" className="text-2x"/>
                                </div>
                                <div className="clear">
                                    <div className="text-muted">医生会诊申请</div>
                                    <h2>18</h2>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="clear y-center">
                                <div className="pull-left mr-m">
                                    <Icon type="contacts" className="text-2x text-info"/>
                                </div>
                                <div className="clear">
                                    <div className="text-muted">会诊专家</div>
                                    <h2>20</h2>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="clear y-center">
                                <div className="pull-left mr-m">
                                    <Icon type="team" className="text-2x text-success"/>
                                </div>
                                <div className="clear">
                                    <div className="text-muted">解答疑问</div>
                                    <h2>102</h2>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col className="gutter-row" md={12}>
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="pb-m">
                                <h3>任务</h3>
                                <small>10个已经完成，2个待完成，1个正在进行中</small>
                            </div>
                            <span className="card-tool"><Icon type="sync"/></span>
                            <Timeline>
                                <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                                <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                                <Timeline.Item color="red">
                                    <p>联调接口</p>
                                    <p>功能验收</p>
                                </Timeline.Item>

                                <Timeline.Item color="#108ee9">
                                    <p>登录功能设计</p>
                                    <p>权限验证</p>
                                    <p>页面排版</p>
                                </Timeline.Item>
                            </Timeline>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
};

export default Home;