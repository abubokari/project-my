import React from "react";
import { Alert, Button, Card } from "antd";
import { Link } from "react-router-dom";
const Error = () => {
  return (
    <>
      <Card title="404">
        <Alert
          style={{
            marginTop: 16,
            marginBottom:16
          }}
          message="Page Not Fount"
          description="The url you want visit its not exists"
          type="error"
          showIcon
        />
        <Link to="/">
          <Button type="dashed">Back to Home</Button>
        </Link>
      </Card>
    </>
  );
};

export default Error;



