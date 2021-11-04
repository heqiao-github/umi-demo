import React, { Component } from 'react'
import { connect } from 'umi'
import { Form, Input, Button, Spin, Modal } from 'antd'

import './index.less'

const FormItem = Form.Item
const { confirm } = Modal

class Ui extends Component {

    state = {
        visible: false,
        account: '',
        password: '',
    }

    submitHandle = (values) => {
        const { account, password } = values
        if (!account) {
            
            return
        }

        if (!password) {
            
            return
        }

        this.setState({ visible: true, account, password })
    }

    doLogin = (backToken, pointJson, callback) => {
        const { account, password } = this.state
        this.props.dispatch({
            type: 's_login/login',
            payload: { account, password, backToken, pointJson },
            callback: (data) => {
                if (data) {
                    if (data.errCode && data.errCode === 10001) {
                        //处理验证码
                        callback(data)
                        confirm({
                            title: '您的密码超过90天未修改',
                            content: <span style={{ color: '#ff0000' }}>为保障帐号安全，请修改后在进行登录</span>,
                            okText: '修改',
                            cancelText: '取消',
                            onOk: () => {
                                this.toForgot()
                            },
                        })
                    } else {
                        if (data.changePwd) {
                            //处理验证码
                            callback(data)
                            confirm({
                                title: '密码强度不符合要求',
                                content: '请修改密码后再次尝试登录',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    this.toForgot()
                                },
                            })
                        } else {
                            localStorage.setItem('token', data.msg)
                            this.props.dispatch({
                                type: 's_base/init',
                                payload: '/'
                            })
                        }
                    }
                } else {
                    //处理验证码
                    callback()
                }
            }
        })
    }

    toForgot = () => {
        this.props.dispatch({
            type: 's_base/go',
            payload: '/forgot'
        })
    }

    render() {
        const { loading } = this.props.state
        const { visible } = this.state

        return (
            <div className='login'>
                <div className='c-inner'>
                    <Spin spinning={loading}>
                        <div className="c-row" style={{ height: 375 }}>
                            <div className="tag"></div>
                            <div className="c-auto">
                                <div className="logo"></div>
                                <Form onFinish={this.submitHandle} layout="vertical">

                                    <FormItem label="账号" name="account" required style={{ marginBottom: 12 }}>
                                        <Input autoComplete="false" maxLength={20} placeholder="请输入账号" />
                                    </FormItem>

                                    <FormItem label="密码" name="password" required style={{ marginBottom: 12 }}>
                                        <Input.Password maxLength={20} autoComplete="false" placeholder="请输入密码" />
                                    </FormItem>

                                    <FormItem style={{ marginBottom: 0 }}>
                                        <div className="text-right">
                                            <a onClick={this.toForgot}>忘记密码？</a>
                                        </div>
                                    </FormItem>
                                    <Button type="primary" htmlType="submit" className="w-100" onClick={this.doLogin}>登录</Button>
                                </Form>
                            </div>
                            <div className="i-r">
                                <div className="tag-blue"></div>
                            </div>
                        </div>

                    </Spin>
                </div>
                <div className="text-center footer">Copyright  1998-2020, MicroPort Scientific Corporation. All rights reserved.</div>
            </div>
        )
    }
}
//export default connect(({ s_login }) => ({ state: s_login }))(Ui)