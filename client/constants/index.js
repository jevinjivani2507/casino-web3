import { createCampaign, dashboard, logout, payment, profile, withdraw, craps } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/CreateCampaign',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/',
    disabled: true,
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/Profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];

export const games = [
  {
    id: 1,
    title: 'Craps',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
  {
    id: 2,
    title: 'Craps',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
  {
    id: 3,
    title: 'Craps',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
  {
    id: 4,
    title: 'Craps',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
  {
    id: 5,
    title: 'Craps',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
];