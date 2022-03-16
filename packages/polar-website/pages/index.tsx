import type {NextPage} from 'next';
import {ProductSection} from 'components/HomePage/ProductSection';
import {FeaturesSection} from 'components/HomePage/FeaturesSection';
import {Footer} from 'components/Footer';

const Home: NextPage = () => {

    return (
        <>
            <main>
                <ProductSection />
                <FeaturesSection />
            </main>
            <Footer />
        </>
    );
};

export default Home;
