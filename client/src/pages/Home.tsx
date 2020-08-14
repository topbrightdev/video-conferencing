import React from 'react';
import Layout, { Header, Footer } from '../components/Layout';
import Content from '../components/Layout/Content';

const HomePage: React.FC = () => {
    return (
        <Layout>
            <Header />
            <Content>
                <div className="text-balck">Home</div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default HomePage;
