def validate(data, fields):
    """
    Validates data to be sure it's not empty or null.
    """
    # form violations errors
    violations = {}

    # for each field, check if it's present
    for field in fields:
        # check if the field is part the data items
        if not any(field in item for item in data.items()):
            # build violation error
            if field not in violations:
                violations[field] = {'errors': []}
            violations[field]['errors'].append(f'Field "{field}" is required')
        else:
            # if the field is part of the data, check if its value is not empty
            for key, value in data.items():
                # if we have an empty value
                if key == field and (value is None or value == ''):
                    # build violation error
                    if field not in violations:
                        violations[field] = {'errors': []}
                    # put the key in the errors
                    violations[field]['errors'].append(f'This field cannot be empty')
                    break

    return violations
