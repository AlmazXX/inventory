create schema inventory collate utf8mb3_general_ci;

create table inventory.categories
(
    id          int auto_increment,
    title       varchar(200) not null,
    description text         not null,
    constraint categories_pk
            primary key (id)
);

create table inventory.locations
(
    id          int auto_increment,
    title       varchar(200) not null,
    description text         not null,
    constraint locations_pk
            primary key (id)
);

create table inventory.records
(
    id          int auto_increment,
    category_id int          not null,
    location_id int          not null,
    title       varchar(200) not null,
    description text         not null,
    image       varchar(100) null,
    constraint records_pk
        primary key (id),
    constraint records_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint records_locations_id_fk
        foreign key (location_id) references locations (id)
);