// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Scraped Items',
    path: '/panel',
    icon: icon('ic_cart'),
  },
  {
    title: 'Listings',
    path: '/listings',
    icon: icon('ic_cart'),
  },
  {
    title: 'Suppliers',
    path: '/suppliers',
    icon: icon('ic_cart'),
  },
  {
    title: 'Stores',
    path: '/stores',
    icon: icon('ic_cart'),
  }
];

export default navConfig;
