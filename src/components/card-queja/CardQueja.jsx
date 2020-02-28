import React from 'react';
import {
  Tag,
  Card,
} from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  WarningTwoTone,
} from '@ant-design/icons';

const { Meta } = Card;

const CardNoticia = ({ queja: { titulo, descripcion, fecha, apto} }) => (
  <Card
    actions={[
      <div>
        <Tag>12</Tag>
        <LikeOutlined key="like" />
      </div>,
      <div>
        <Tag>12</Tag>
        <CommentOutlined key="message" />
      </div>,
      <div>
        <Tag>12</Tag>
        <DislikeOutlined key="dislike" />
      </div>,
    ]}
  >
    <Meta
      avatar={<WarningTwoTone />}
      title={titulo}
      description={descripcion}
    />
  </Card>
);

export default CardNoticia;