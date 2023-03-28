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
    title: 'Craps By Ustad',
    image: craps,
    link: '/',
    owner: '0x1C61FeFAA240C08B9D11bE13f599467baAb303F3',
    amountCollected: 1,
    target: 5,
    remainingDays: '2Hrs',
  },
];