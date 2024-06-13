if pgrep -x "node" > /dev/null
then
    echo "Node process is already running. Exiting..."
    exit 1
else
    # Change directory to your project directory
    cd /home/jelastic/ROOT/backend/
    
    # Start the npm process
    npm start
fi