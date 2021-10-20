from flask import Flask
from flask import request
from flask_cors import CORS
import json
import time
import _datetime
import random

# Init flask and cors
api = Flask(__name__)
cors = CORS(api, resources={r"/*": {"origins": "*"}})

# Load config file
config = json.load(open('./config.json'))


def save_config(data):
    with open('./config.json', 'w') as outfile:
        json.dump(data, outfile)


@api.route('/', methods=['GET'])
def root():
    # Load config file
    config = json.load(open('./config.json'))

    # Search for class with specific name
    class_index = -1
    for i in range(len(config['class-settings'])):
        if(config['class-settings'][i]['name'] == str(request.args.get('class'))):
            class_index = i
            break

    # If class exists, return lucky number of generate new numbers list if old one is empty
    if(class_index != -1):
        # Generate new shuffled numbers array if old one is empty
        if(len(config['class-settings'][class_index]['numbers']) < 1):
            config['class-settings'][class_index]['numbers'] = list(range(1, config['class-settings'][class_index]['number-of-students']+1))
            random.shuffle(config['class-settings'][class_index]['numbers'])

        # Check time from last new number generation
        date_last = _datetime.datetime.strptime(config['class-settings'][class_index]['last-generation-time'], '%Y-%m-%d')
        date_now = _datetime.datetime.now()
        if((date_now - date_last).days >= config['class-settings'][class_index]['new-number-generation-period']):
            config['class-settings'][class_index]['last-generation-time'] = date_now.strftime("%Y-%m-%d")
            config['class-settings'][class_index]['numbers'].pop(0)

        # Save changes to config files
        save_config(config)

        # Return lucky number in get response
        number = config['class-settings'][class_index]['numbers'][0]
        return {"response": number}
    else:
        return '{"response": "class not found"}'


@api.route('/classes', methods=['GET'])
def classes():
    config = json.load(open('./config.json'))
    classes = []
    for element in config['class-settings']:
        classes.append(element['name'])
    print(str(classes))
    return {"response": classes}


if __name__ == '__main__':
    api.run()
