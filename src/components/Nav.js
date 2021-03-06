import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
	HomeOutlined,
	ProfileOutlined,
	FileProtectOutlined,
} from "@ant-design/icons";

const Nav = (props) => {
	const { current } = props;

	return (
		<div>
			<Menu selectedKeys={[current]} mode="horizontal">
				<Menu.Item key="home">
					<Link to={`/`}>
						<HomeOutlined /> Todos
					</Link>
				</Menu.Item>
				<Menu.Item key="profile">
					<Link to="/profile">
						<ProfileOutlined /> Profile
					</Link>
				</Menu.Item>
				<Menu.Item key="create">
					<Link to="/create">
						<FileProtectOutlined /> Create Todo
					</Link>
				</Menu.Item>
			</Menu>
		</div>
	);
};

export default Nav;
