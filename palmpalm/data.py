# -*- coding: utf-8 -*-
#
# test data before backend integration is ready

from django.conf import settings

from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse_lazy

STATIC_URL = settings.STATIC_URL

header = {
    'menu': [
        {
            'dropdown': 'true',
            'title': 'Products'
        },
        {
            'url': reverse_lazy('front:login-popup'),
            'icon': 'user'
        },
        {
            'url': reverse_lazy('front:cart-popup'),
            'icon': 'bag'
        }
    ],
    'nav': [
        {
            'url': reverse_lazy('front:index'),
            'title': 'Products'
        },
        {
            'url': reverse_lazy('front:blog'),
            'title': 'Blog'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Wholesale inquiry'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Contact Us'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'About Us'
        }
    ],
    'links': [
        {
            'url': reverse_lazy('front:index'),
            'title': 'Privacy Policy'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Terms & Conditions'
        }
    ]
}

social = [
    {
        'url': 'https://www.facebook.com/',
        'icon': 'facebook'
    },
    {
        'url': 'https://twitter.com/',
        'icon': 'twitter'
    },
    {
        'url': 'https://linkedin.com/',
        'icon': 'linkedin'
    },
    {
        'url': 'https://www.instagram.com/',
        'icon': 'instagram'
    }
]

footer = {
    'title': 'Still have questions? Contact us',
    'phone': '888-659-0892',
    'email': 'info@palmtopalm.com',
    'nav': [
        {
            'url': reverse_lazy('front:index'),
            'title': 'Products'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Wholesale inquiry'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'About us'
        },
        {
            'url': reverse_lazy('front:blog'),
            'title': 'Blog'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Contact us'
        }
    ],
    'copyright': '2020 Trinity Packaging Supply. All rights reserved.',
    'links': [
        {
            'url': reverse_lazy('front:index'),
            'title': 'Terms & Conditions'
        },
        {
            'url': reverse_lazy('front:index'),
            'title': 'Privacy Policy'
        }
    ]
}

index = {
    'OG': {
        'title': u'Index',
        'description': u'Index Description',
        'image': {
            'url': staticfiles_storage.url('img/share/index.png'),
            'width': 1200,
            'height': 630,
        }
    },
    'hero': {
        'title': '<div><span>Clean hands.</span></div><div><span>Anywhere.</span></div><div><span>Anytime.</span></div>',
        'text': u'palmpalm   is a new hand sanitizer that’s medically approved, smooth on&nbsp;the skin and available in all sizes.',
        'button': {
            'label': 'Order now',
            'url': reverse_lazy('front:index')
        },
        'phone': {
            'label': '856 520-8332',
            'url': 'tel:8565208332'
        },
        'mail': {
            'label': 'info@trinitypkgs.com',
            'url': 'mailto:info@trinitypkgs.com'
        },
        'order': {
            'label': 'Order now'
        }
    },
    'video': {
        'video': {
            'phone': staticfiles_storage.url('img/front/IndexVideo/phone.mp4'),
            'tablet': staticfiles_storage.url('img/front/IndexVideo/tablet.mp4'),
            'desktop': staticfiles_storage.url('img/front/IndexVideo/desktop.mp4'),
            'poster': staticfiles_storage.url('img/front/IndexVideo/poster.jpg'),
        },
        'poster': {
            'medium': staticfiles_storage.url('img/index/video/medium.jpg'),
            'big': staticfiles_storage.url('img/index/video/big.jpg'),
        },
        'title': 'Things might be unpredictable but your safety never should. That’s why we developed palmpalm  sanitizer'
    },
    'reviews': {
        'title': 'We only work together',
        'list': [
            {
                'image': staticfiles_storage.url('img/index/slider/1.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/1@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            },
            {
                'image': staticfiles_storage.url('img/index/slider/2.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/2@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            },
            {
                'image': staticfiles_storage.url('img/index/slider/3.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/3@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            },
            {
                'image': staticfiles_storage.url('img/index/slider/1.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/1@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            },
            {
                'image': staticfiles_storage.url('img/index/slider/2.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/2@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            },
            {
                'image': staticfiles_storage.url('img/index/slider/3.jpg'),
                'image2x': staticfiles_storage.url('img/index/slider/3@2x.jpg'),
                'text': 'What I liked about Trinity was their transparency and their patience and willingness to explain and help us.',
                'owner': 'Anna Tompson, NL Industry'
            }
        ],
        'cursor': {
            'prev': 'Previous',
            'next': 'Next'
        }
    },
    'brands': {
        'title': 'Trusted by Top Brands',
        'list': [
            {
                'icon': 'target'
            },
            {
                'icon': 'nike'
            },
            {
                'icon': 'five'
            },
            {
                'icon': 'party'
            }
        ]
    },
    'articles': [
        {
            'text': 'Pocket-sized scentless hand sanitizer in a six pack. Maybe the company’s name will remind you to wash your hands as well.',
            'link': {
                'url': reverse_lazy('front:blog'),
                'title': 'Read Full Article'
            },
            'logo': 'gq'
        },
        {
            'text': 'The brand Palmpalm was created as a direct response to the COVID-19 pandemic.',
            'link': {
                'url': reverse_lazy('front:blog'),
                'title': 'Read Full Article'
            },
            'logo': 'people'
        },
        {
            'text': 'These wipes are made with 70% ethyl alcohol, and can be used to kill germs on both your hands and surfaces, making them an incredibly handy germ-fighting tool to have around. ',
            'link': {
                'url': reverse_lazy('front:blog'),
                'title': 'Read Full Article'
            },
            'logo': 'forbes'
        }
    ],
    'news': {
        'title': 'Latest news',
        'list': [
            {
                'url': reverse_lazy('front:blog'),
                'image': staticfiles_storage.url('img/index/news/1.jpg'),
                'image2x': staticfiles_storage.url('img/index/news/1@2x.jpg'),
                'date': 'June 10, 2020',
                'title': 'Is it Safe to Swim and Surf During COVID-19?',
                'text': 'Summer is almost here! Is it safe to swim and do watersports now? We’ve got answers from the experts on whether or not it’s time to take on those beach waves or take a plunge in the pool.'
            },
            {
                'url': reverse_lazy('front:blog'),
                'image': staticfiles_storage.url('img/index/news/2.jpg'),
                'image2x': staticfiles_storage.url('img/index/news/2@2x.jpg'),
                'date': 'June 8, 2020',
                'title': 'How and When to Use Hand Sanitizer',
                'text': 'There’s nothing like 20 seconds with soap and running water for really cleaning your hands well.'
            },
            {
                'url': reverse_lazy('front:blog'),
                'image': staticfiles_storage.url('img/index/news/3.jpg'),
                'image2x': staticfiles_storage.url('img/index/news/3@2x.jpg'),
                'date': 'June 3, 2020',
                'title': 'Face Touching Can Increase the Risk of Viral Infection',
                'text': 'You may be surprised to learn that you likely touch your face more often than you realize. Studies show we touch our faces multiple times per hour.'
            }
        ],
        'cursor': 'Learn more'
    },
    'faq': {
        'title': 'So now you’re probably wondering...',
        'list': [
            {
                'question': 'Does it really work?',
                'answer': 'We specialize in national accounts, helping our customers realize cost savings, greater efficiency, and simplicity by ordering from one source.'
            },
            {
                'question': 'Does palmpalm comply with all WHO recommendations?',
                'answer': 'We specialize in national accounts, helping our customers realize cost savings, greater efficiency, and simplicity by ordering from one source.'
            },
            {
                'question': 'How do we know it’s actually effective?',
                'answer': 'We specialize in national accounts, helping our customers realize cost savings, greater efficiency, and simplicity by ordering from one source.'
            },
            {
                'question': 'How quickly are the bacteria destroyed?',
                'answer': 'We specialize in national accounts, helping our customers realize cost savings, greater efficiency, and simplicity by ordering from one source.'
            }
        ]
    }
}

checkout = {
    'OG': {
        'title': u'Index',
        'description': u'Index Description',
        'image': {
            'url': staticfiles_storage.url('img/share/index.png'),
            'width': 1200,
            'height': 630,
        }
    },
    'title': 'Checkout',
    'breadcrumbs': [
        {
            'title': 'Payment Method'
        },
        {
            'title': 'Checkout Details'
        },
        {
            'title': 'Order Complete'
        }
    ],
    'payment': {
        'title': 'Express checkout',
        'list': [
            {
                'type': 'PayPal',
                'icon': 'paypal'
            },
            {
                'type': 'Amazon',
                'icon': 'amazon'
            },
            {
                'type': 'Apple',
                'icon': 'apple'
            }
        ]
    },
    'card': {
        # 'state': 'logged',
        'button': 'Credit Card',
        'text': 'Visa, Mastercard, AMEX or Discover',
        'dataTitle': 'Credit Card checkout',
        'personalTitle': 'Personal Information',
        'loginTitle': 'Already have an account?',
        'loginButtonUrl': reverse_lazy('front:login-popup'),
        'loginButtonTitle': 'Sign In',
        'formEmail': 'Email Address',
        'addressTitle': 'Shipping Address',
        'formFirstName': 'First Name',
        'formLastName': 'Last Name',
        'formCompany': 'Company Name (optional)',
        'formStreetAddress': 'Street Address',
        'formApt': 'Apt, suite, unit',
        'formZip': 'ZIP',
        'formPhone': 'Phone',
        'checkboxCaption': 'Billing Address is the same as Shipping Address',
        'cardTitle': 'Credit Card',
        'formCardNumber': 'Card Number',
        'formCardDate': 'MM / YY',
        'formCardCVC': 'CVC',
        'billingAddressTitle': 'Billing Address',
        'userName': 'Jason Bloomquist',
        'userEmail': 'jason.bloomquist@gmail.com',
        'userButton': 'Log out',
        'shipTitle': 'Ship to'
    },
    'alert': 'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.',
    'order': {
        'title': 'You Order',
        'quantity': '3',
        'list': [
            {
                'image': staticfiles_storage.url('img/products/cart/1.png'),
                'image2x': staticfiles_storage.url('img/products/cart/1@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Hand Sanitizer Gel Pump Top',
                'caption': '16.9 oz, 6-pack',
                'quantity': '1',
                'price': '$29.00'
            },
            {
                'image': staticfiles_storage.url('img/products/cart/2.png'),
                'image2x': staticfiles_storage.url('img/products/cart/2@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Hand Sanitizer Gel',
                'caption': '8 oz, 6-pack',
                'quantity': '1',
                'price': '$37.60'
            },
            {
                'image': staticfiles_storage.url('img/products/cart/3.png'),
                'image2x': staticfiles_storage.url('img/products/cart/3@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Liquid Hand Sanitizer',
                'caption': '8 oz, 6-pack',
                'quantity': '1',
                'price': '$29.00'
            },
            {
                'image': staticfiles_storage.url('img/products/cart/1.png'),
                'image2x': staticfiles_storage.url('img/products/cart/1@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Hand Sanitizer Gel Pump Top',
                'caption': '16.9 oz, 6-pack',
                'quantity': '1',
                'price': '$29.00'
            },
            {
                'image': staticfiles_storage.url('img/products/cart/2.png'),
                'image2x': staticfiles_storage.url('img/products/cart/2@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Hand Sanitizer Gel',
                'caption': '8 oz, 6-pack',
                'quantity': '1',
                'price': '$37.60'
            },
            {
                'image': staticfiles_storage.url('img/products/cart/3.png'),
                'image2x': staticfiles_storage.url('img/products/cart/3@2x.png'),
                'url': reverse_lazy('front:index'),
                'title': 'Liquid Hand Sanitizer',
                'caption': '8 oz, 6-pack',
                'quantity': '1',
                'price': '$29.00'
            }
        ],
        'info': [
            {
                'title': 'Promo Code',
                'button': 'Enter Code'
            },
            {
                'title': 'Tax',
                'value': '$9.50'
            },
            {
                'title': 'Shipping',
                'value': '$0.00'
            }
        ],
        'priceTitle': 'Total',
        'priceAmount': '$105.10',
        'button': 'Place Order'
    }
}

products = {
    'categories': [
        {
            'list': [
                {
                    'title': 'Gel'
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '2 oz Travel Size',
                    'image': staticfiles_storage.url('img/products/popup/1.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/1@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '8 oz Disc Top',
                    'image': staticfiles_storage.url('img/products/popup/2.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/2@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '16 oz Pump Tool',
                    'image': staticfiles_storage.url('img/products/popup/3.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/3@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '1 Gallon Jag',
                    'image': staticfiles_storage.url('img/products/popup/4.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/4@2x.png')
                }
            ]
        },
        {
            'list': [
                {
                    'title': 'Liquid'
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '6.7 oz Mist Top Spray',
                    'image': staticfiles_storage.url('img/products/popup/5.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/5@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '8 oz Disc Top',
                    'image': staticfiles_storage.url('img/products/popup/6.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/6@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '1 Gallon',
                    'image': staticfiles_storage.url('img/products/popup/7.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/7@2x.png')
                }
            ]
        },
        {
            'list': [
                {
                    'title': 'Wipes'
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '10 Count',
                    'image': staticfiles_storage.url('img/products/popup/8.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/8@2x.png')
                },
                {
                    'url': reverse_lazy('front:index'),
                    'title': '50 Count',
                    'image': staticfiles_storage.url('img/products/popup/9.png'),
                    'image2x': staticfiles_storage.url('img/products/popup/9@2x.png')
                }
            ]
        }
    ],
    'image': staticfiles_storage.url('img/products/popup/product.png'),
    'image2x': staticfiles_storage.url('img/products/popup/product@2x.png')
}

login = {
    'title': 'Account',
    'formTitle': 'Sign in to my account',
    'formEmail': 'Email Address',
    'formPassword': 'Password',
    'controlButton': 'Forgot your password?',
    'formButton': 'Login',
    'promptTitle': 'New client?',
    'promptLink': 'Create an account'
}

cart = {
    'title': 'Shopping Cart',
    'quantity': '3',
    'list': [
        {
            'image': staticfiles_storage.url('img/products/cart/1.png'),
            'image2x': staticfiles_storage.url('img/products/cart/1@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Hand Sanitizer Gel Pump Top',
            'caption': '16.9 oz, 6-pack',
            'price': '$29.00'
        },
        {
            'image': staticfiles_storage.url('img/products/cart/2.png'),
            'image2x': staticfiles_storage.url('img/products/cart/2@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Hand Sanitizer Gel',
            'caption': '8 oz, 6-pack',
            'price': '$37.60'
        },
        {
            'image': staticfiles_storage.url('img/products/cart/3.png'),
            'image2x': staticfiles_storage.url('img/products/cart/3@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Liquid Hand Sanitizer',
            'caption': '8 oz, 6-pack',
            'price': '$29.00'
        },
        {
            'image': staticfiles_storage.url('img/products/cart/1.png'),
            'image2x': staticfiles_storage.url('img/products/cart/1@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Hand Sanitizer Gel Pump Top',
            'caption': '16.9 oz, 6-pack',
            'price': '$29.00'
        },
        {
            'image': staticfiles_storage.url('img/products/cart/2.png'),
            'image2x': staticfiles_storage.url('img/products/cart/2@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Hand Sanitizer Gel',
            'caption': '8 oz, 6-pack',
            'price': '$37.60'
        },
        {
            'image': staticfiles_storage.url('img/products/cart/3.png'),
            'image2x': staticfiles_storage.url('img/products/cart/3@2x.png'),
            'url': reverse_lazy('front:index'),
            'title': 'Liquid Hand Sanitizer',
            'caption': '8 oz, 6-pack',
            'price': '$29.00'
        }
    ],
    'undoTitle': 'Item removed',
    'undoButton': 'Undo',
    'alertTitle': 'Your bag is currently empty',
    'subtotalTitle': 'Subtotal',
    'subtotalAmount': '$95.00',
    'button': 'Checkout',
    'paymentTitle': 'Easy checkout with',
    'paymentList': [
        {
            'icon': 'amazon'
        },
        {
            'icon': 'apple'
        }
    ]
}

notFound = {
    'title': 'Page not found',
    'OG': {
        'title': u'404',
        'description': u'404',
        'image': {
            'url': staticfiles_storage.url('img/share/index.png'),
            'width': 1200,
            'height': 630,
        }
    }
}

blog = {
    'OG': {
        'title': u'Blog',
        'description': u'Blog Description',
        'image': {
            'url': staticfiles_storage.url('img/share/index.png'),
            'width': 1200,
            'height': 630,
        }
    },
    'hero': {
        'title': 'Blog',
        'posted': 'Posted by',
        'list': [
            {
                'date': 'June 10, 2020',
                'post': 'Palmpalm',
                'postUrl': '',
                'title': 'Is it Safe to Swim <br>and Surf During <br>COVID-19?',
                'image': staticfiles_storage.url('img/blog-article/hero.png'),
                'image2x': staticfiles_storage.url('img/blog-article/hero@2x.png'),
                'url': reverse_lazy('front:blog-article', args=['is-it-safe-to-swim-and-surf-during-covid-19'])
            },
            {
                'date': 'June 20, 2040',
                'post': 'test',
                'postUrl': '',
                'title': 'Will Covid-19 End <br/>the Handshake?',
                'image': staticfiles_storage.url('img/blog/categories/5.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/5@2x.jpg'),
                'url': reverse_lazy('front:blog-article', args=['is-it-safe-to-swim-and-surf-during-covid-19'])
            }
        ]
    },
    'categories': {
        'posted': 'Posted by',
        'list': [
            {
                'type': 'small',
                'typeRound': 'Hygiene',
                'image': staticfiles_storage.url('img/blog/categories/1.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/1@2x.jpg'),
                'date': 'June 15, 2020',
                'post': 'Palmpalm',
                'title': 'Face Touching Can Increase <br/>the Risk of Viral Infection',
                'url': reverse_lazy('front:blog-article', args=['is-it-safe-to-swim-and-surf-during-covid-19']),
            },
            {
                'type': 'small',
                'typeRound': 'Hygiene',
                'image': staticfiles_storage.url('img/blog/categories/2.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/2@2x.jpg'),
                'date': 'June 10, 2020',
                'post': 'Palmpalm',
                'title': 'How to Choose the <br/>Best Hand Sanitizer',
                'url': ''
            },
            {
                'type': 'medium',
                'typeRound': 'Hygiene',
                'image': staticfiles_storage.url('img/blog/categories/3.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/3@2x.jpg'),
                'date': 'June 5, 2020',
                'post': 'Palmpalm',
                'title': 'How and When <br/>to Use Hand Sanitizer',
                'url': ''
            },
            {
                'type': 'large',
                'image': staticfiles_storage.url('img/blog/categories/4.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/4@2x.jpg'),
                'title': 'Take a Look <br>at Our Products',
                'url': ''
            },
            {
                'type': 'small',
                'typeRound': 'Advice',
                'image': staticfiles_storage.url('img/blog/categories/5.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/5@2x.jpg'),
                'date': 'May 20, 2020',
                'post': 'Palmpalm',
                'title': 'Protect Yourself from <br/>the Spread COVID-19',
                'url': ''
            },
            {
                'type': 'medium',
                'typeRound': 'Advice',
                'image': staticfiles_storage.url('img/blog/categories/6.jpg'),
                'image2x': staticfiles_storage.url('img/blog/categories/6@2x.jpg'),
                'date': 'May 15, 2020',
                'post': 'Palmpalm',
                'title': 'Will Covid-19 End <br/>the Handshake?',
                'url': ''
            }
        ]
    },
    'news': {
        'title': 'Other news',
        'posted': 'Posted by',
        'button': '<span>Load more</span>',
    }
}

blogArticle = {
    'posted': 'Posted by',
    'back': 'Back to all posts',
    'url': reverse_lazy('front:blog'),
    'news': {
        'title': 'Related news',
        'posted': 'Posted by'
    }
}

articleContent = {
    'is-it-safe-to-swim-and-surf-during-covid-19': {
        'date': 'June 10, 2020',
        'post': 'Palmpalm',
        'postUrl': '',
        'title': 'Is it Safe to Swim <br>and Surf During <br>COVID-19?',
        'image': staticfiles_storage.url('img/blog-article/hero.png'),
        'image2x': staticfiles_storage.url('img/blog-article/hero@2x.png'),
        'list': [
            {
                'title': '<h4>Summer is almost here!</h4>',
                'text': '<p>Is it safe to swim and do watersports now?  We’ve got answers from the experts on whether or not it’s time to take on those beach waves or take a plunge in the pool.</p> <p></p> <p>The bottom line is that there is no evidence that the virus that causes COVID-19 can be spread to people through the water in pools, hot tubs, or water playgrounds, according to experts at the Centers for Disease Control (CDC). Disinfection of the water with chlorine or bromine should inactivate the virus.</p> <p></p> <p>“I can’t say it’s absolutely 100% zero risk, but I can tell you that it would never cross my mind to get COVID-19 from a swimming pool or the ocean,” said Paula Cannon, a professor of molecular microbiology and immunology at USC’s Keck School of Medicine in a MedicalXpress article. “It’s just extraordinarily unlikely that this would happen.”</p>'
            },
            {
                'type': 'quoting',
                'quoting': '<blockquote>“It’s just extraordinarily unlikely that this would happen“</blockquote>',
                'author': '<span>Dr. Daniel Pastula</span>',
                'degree': '<p>UCHealth neuro-infectious disease expert</p>'
            },
            {
                'text': '<p>“I can’t say it’s absolutely 100% zero risk, but I can tell you that it would never cross my mind to get COVID-19 from a swimming pool or the ocean,” said Paula Cannon, a professor of molecular microbiology and immunology at USC’s Keck School of Medicine in a MedicalXpress article. “It’s just extraordinarily unlikely that this would happen.”</p> <p></p> <p>Unlike bacteria, which can survive on water that is not properly cleaned, “viruses are just a strand of RNA or DNA that need a host to survive,” according to Dr. Lakshmi Chauhan, an assistant professor at the University of Colorado School of Medicine in a UCHealth article.</p>'
            },
            {
                'image': staticfiles_storage.url('img/blog-article/1.png'),
                'image2x': staticfiles_storage.url('img/blog-article/1@2x.png'),
            },
            {
                'title': '<h4>The rial risk for infection</h4>',
                'text': '<p>The real risk for infection of COVID-19 relates to the crowds that gather at these places. The virus can spread from person to person when they are in close contact with each other, whether while swimming in the pool, swimming in the ocean, sunning or walking on the sand, or chilling or walking on the deck. It’s easy to forget the importance of proper social distancing when hanging at these places, but still so important. While on land, wear a mask, and remember to stay at least 6 feet apart from others.</p> <p></p> <p>Sports like paddle-boarding, surfing and sailing are low-risk. They tend to be naturally socially distant. If the beach or lake you are going to is open and you are doing these sports away from crowds you should be fine. Remember to wear a mask, stay away from others, and use hand sanitizer on any oars, paddles, etc. that are shared with you.</p>'
            },
            {
                'type': 'quoting',
                'quoting': '<blockquote>“I would think paddle boarding would be a low-risk situation”</blockquote>',
                'author': '<span>Dr. Daniel Pastula</span>',
                'degree': '<p>UCHealth neuro-infectious disease expert</p>'
            },
            {
                'text': '<p>Health experts say you are more likely to catch a viral infection indoors than you are outdoors, so all other things being equal, outdoor pools should be safer than indoor pools. As long as you stay at least 6 feet away from others and follow other COVID-19 prevention measures the possibility of transmission is low at an outdoor pool. The longer you spend enclosed indoors in a public swimming pool, the more likely you are to be exposed to viruses. Indoor pools are a higher risk since viral droplets that are sneezed or coughed stay in the building.</p>'
            }
        ]
    }
}

news = [
    {
        'date': 'Apr 20, 2020',
        'post': 'Palmpalm',
        'url': '',
        'title': 'Protect Yourself from <br/>the Spread COVID-19'
    },
    {
        'date': 'Apr 10, 2020',
        'post': 'Palmpalm',
        'url': '',
        'title': 'Will Covid-19 End <br/>the Handshake?'
    },
    {
        'date': 'Apr 5, 2020',
        'post': 'Palmpalm',
        'url': '',
        'title': 'How and When <br/>to Use Hand Sanitizer'
    },
    {
        'date': 'Mar 10, 2020',
        'post': 'Palmpalm',
        'url': '',
        'title': 'How to Choose the <br/>Best Hand Sanitizer'
    }
]
