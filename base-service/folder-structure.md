--src
    |-- routes              define all routes of application
        |-- web
        |-- api
    |-- controllers         define all controller functions for all routes, export the function
    |-- services            define and implement business logics, export service objects
    |-- repositories        define and implement database queries, export repository objects
    |-- interfaces          define interfaces for db Entity, auth Entity, Repository and Service
    |-- prisma              setup database, orm using prisma
    |-- middlewares         config middlewares, need to injected the express app
    |-- exceptions          define exception handler, need to injected the express app
    |-- providers           define, init engines, load configs, apply another services and define express app
    |-- index.ts            build app