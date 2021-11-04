import styles from './index.css';
import { ConfigProvider } from 'antd';
import {connect, withRouter} from "umi"

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to umi!</h1>
      <ConfigProvider>{props.children}</ConfigProvider>
    </div>
  );
}

export default BasicLayout;
