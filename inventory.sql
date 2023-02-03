CREATE SCHEMA inventory COLLATE utf8mb3_general_ci;

CREATE TABLE inventory.categories
(
    id          int auto_increment,
    title       varchar(200) not null,
    description text         not null,
    constraint categories_pk
        primary key (id)
);

CREATE TABLE inventory.locations
(
    id          int auto_increment,
    title       varchar(200) not null,
    description text         not null,
    constraint locations_pk
        primary key (id)
);

CREATE TABLE inventory.records
(
    id            int auto_increment,
    category_id   int                    not null,
    location_id   int                    not null,
    title         varchar(200)           not null,
    description   text                   not null,
    image         varchar(100)           null,
    registered_at datetime default NOW() not null,
    constraint records_pk
        primary key (id),
    constraint records_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint records_locations_id_fk
        foreign key (location_id) references locations (id)
);

INSERT INTO inventory.categories (title, description)
VALUES ('Furniture', 'Office furniture'),
       ('Computer equipment', 'Laptops and supplies');

INSERT INTO inventory.locations (title, description)
VALUES ('Development', 'Developers room'),
       ('Product Development', 'PMs room');

INSERT INTO inventory.records (category_id, location_id, title, description, registered_at)
VALUES (1, 1, 'Chair', 'Chair for developers room', '2023-01-01 15:00:00'),
       (2, 2, 'MacBook', 'MacBook for PMs room', '2023-01-01 15:10:00');