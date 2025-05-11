
-- #1 INSERT VALUES
INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- #2 UPDATE  A QUEARY
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';


-- #3 DELETE A QUERY

DELETE FROM public.account
WHERE account_firstname = 'Tony';

-- #4 UPDATE INFO

UPDATE public.inventory
SET inv_description = REPLACE (inv_description,'small interiors','huge interior')
WHERE inv_id = 10;

-- #5 INNER JOIN
SELECT inv_make, inv_model, classification.classification_name
FROM inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- #6 UPDATE QUERIES

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');