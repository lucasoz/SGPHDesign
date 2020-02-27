// se saco de card

import React from "react";
import { Skeleton, Tag, Card, Icon } from "antd";

const CardNoticia = ({ loading }) => (
  <Card
    actions={[
      <div>
        <Tag>12</Tag>
        <Icon type="like" key="like" />
      </div>,
      <div>
        <Tag>12</Tag>
        <Icon type="message" key="message" />
      </div>,
      <div>
        <Tag>12</Tag>
        <Icon type="dislike" key="dislike" />
      </div>
    ]}
  >
    <Skeleton loading={loading} avatar active />
    <img
      src="https://images.unsplash.com/photo-1500622944204-b135684e99fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      style={{
        width: "100%",
        height: "auto"
      }}
      alt="noticia"
    />
    <div
      style={{
        padding: 10,
        background: "rgba(0, 0, 0, 0.05)",
        border: "1px rgba(0, 0, 0, 0.1) solid",
        marginTop: 10
      }}
    >
      content
    </div>
  </Card>
);

export default CardNoticia;
