import React from 'react';
import { notification, Icon } from 'antd';

export const notiSuccess = (description) => (
  notification.error({
    closeIcon: <Icon type="close" style={{color: "white"}} />,
    className: 'successNoti',
    description,
    icon: <Icon type="check-circle" style={{color: "white"}} />,
    message: <span style={{ color: 'white' }} >Correcto!</span>,
    placement: 'bottomLeft',
  })
);

export const notiError = (description) => (
  notification.error({
    message: <span style={{ color: 'white' }} >Error!</span>,
    description,
    placement: 'bottomLeft',
    className: 'errorNoti',
    icon: <Icon type="close-circle" style={{color: "white"}} />,
    closeIcon: <Icon type="close" style={{color: "white"}} />,
  })
);