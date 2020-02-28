import React from 'react';
import { notification } from 'antd';
import { CloseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const notiSuccess = (description) => (
  notification.error({
    closeIcon: <CloseOutlined style={{ color: 'white' }} />,
    className: 'successNoti',
    description,
    icon: <CheckCircleOutlined style={{ color: 'white' }} />,
    message: <span style={{ color: 'white' }}>Correcto!</span>,
    placement: 'bottomLeft',
  })
);

export const notiError = (description) => (
  notification.error({
    message: <span style={{ color: 'white' }}>Error!</span>,
    description,
    placement: 'bottomLeft',
    className: 'errorNoti',
    icon: <CloseCircleOutlined style={{ color: 'white' }} />,
    closeIcon: <CloseOutlined style={{ color: 'white' }} />,
  })
);
