// se saco de card

import React from 'react';
import { Skeleton, Tag, Card } from 'antd';
import { LikeOutlined, CommentOutlined, DislikeOutlined } from '@ant-design/icons';

const CardNoticia = ({ loading }) => (
  <Card
    cover={<img
      src="https://images.unsplash.com/photo-1500622944204-b135684e99fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      style={{
        width: "100%",
        height: "auto",
      }}
      alt="noticia"
    />}
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
    <Skeleton loading={loading} avatar active />
    Texto de prueba
  </Card>
);

export default CardNoticia;
