-- classification table
SELECT *
FROM public.classification;
--
SELECT classification_name
FROM public.classification
WHERE classification_id = 4;
--
SELECT classification_name
FROM public.classification
WHERE classification_name LIKE '%por%';
--
INSERT INTO public.classification
VALUES (default, 'Convertible');

--
UPDATE public.classification
SET classification_name = 'Hatchback'
WHERE classification_id = (
        SELECT classification_id
        WHERE classification_name = 'Convertible'
    );
--
DELETE FROM public.classification
WHERE classification_id = 6;
-- inventory table
SELECT *
FROM public.inventory;
SELECT inventory.inv_year,
    COUNT(inventory.inv_year) AS number
FROM public.inventory
WHERE inv_year = '2016'
GROUP BY inv_year;
SELECT COUNT(inv_model)
FROM public.inventory
GROUP BY inv_year;
-- 1 Write SQL statements to accomplish the following tasks. Each task should be performed using a single query per task:
-- INSERT Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO account (
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES (
        default,
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n',
        default
    );
SELECT *
FROM account;
-- 2- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- 3-Delete the Tony Stark record from the database.
DELETE FROM account
WHERE account_id = 1;
-- 4 -Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" 
--using a single query. Explore the PostgreSQL Replace function Do NOT retype the entire description
--as part of the query.. It needs to be part of an Update query as shown in the code examples of this
--SQL Reading\
SELECT *
FROM inventory;

UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- 5- Use an inner join to select the make and model fields from the inventory table 
-- and the classification name field from the classification table for inventory 
-- items that belong to the "Sport" category. These resources may help you: 
--https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/.
--Two records should be returned as a result of the query.
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';
-- 6- Update all records in the inventory table to add "/vehicles" to the middle of 
-- the file path in the inv_image and inv_thumbnail columns using a single query. This
-- reference may prove helpful
-- https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-replace/.
-- When done the path for both inv_image and inv_thumbnail should resemble this example: 
-- /images/vehicles/a-car-name.jpg
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');