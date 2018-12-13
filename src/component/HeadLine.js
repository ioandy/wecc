import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col, Icon, Breadcrumb, Button} from 'antd'; //

const HeadLine = (props) => {

    const {breadcrumbs = [], buttons = []} = props;
    let breads = [], btns = [];
    breadcrumbs.map((item, i) => {
        return breads.push(
            <Breadcrumb.Item key={i}>
                <Link to={item.path}><Icon type={item.icon}/>&nbsp;<span>{item.text}</span></Link>
            </Breadcrumb.Item>
        )
    });
    buttons.map((item, i) => {
        return btns.push(<Button key={i} size={'small'} type={item.type} icon={item.icon}
                                 onClick={item.callback}>{item.text}</Button>);
    });
    return (
        <Row gutter={8}>
            <Col span={12}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to='/home'><Icon type="home"/></Link></Breadcrumb.Item>
                    {breads}
                </Breadcrumb>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
                {btns}
            </Col>
        </Row>
    )
};
export default HeadLine;