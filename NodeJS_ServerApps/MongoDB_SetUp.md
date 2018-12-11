

### INSTALLATION:
    $brew update

    $sudo chown -R $(whoami) $(brew --prefix)/*

    $rew install mongodb
    
### Default uses /data/db

    $mongod
    >
### Use below command to specify other destination..

    $mongod --dbpath Documents/mongodb/data/db

### Will run MongoDB server on 'mongodb://localhost:27017'

##### ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### USAGE:
### To create Database, open up new terminal and

    $mongo ENTER
    > show dbs
    admin                  0.000GB
    config                 0.000GB
    local                  0.000GB
    sample_item_inventory  0.000GB
    >
    > use sample_item_inventory
    switched to db sample_item_inventory
    > show tables
    items
    >CTRL+D
    $
