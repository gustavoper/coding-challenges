const undoRedo = object => {
  
  
    function History(type, key, oldVal, newVal) {
      this.type = type;
      this.key = key;
      this.oldVal = oldVal;
      this.newVal = newVal;
    }
    function UndoNotAvailableException() {
      this.name = 'UndoNotAvailableException';
      this.message =  'Oops, unable to undo!';
    }
    function RedoNotAvailableException() {
      this.name = 'RedoNotAvailableException';
      this.message =  'Oops, unable to redo!';
    }
  
    var history = [];
    var index = 0;
    return {
      set: function(key, value) {
        if (object.hasOwnProperty(key))
          history.push(new History('set', key, object[key], value));
        else 
          history.push(new History('new', key, null, value));
        object[key] = value;
        index++;
        history.length = index;
      },
      get: function(key) {
        return object[key];
      },
      del: function(key) {
        history.push(new History('del', key, object[key], null));
        delete object[key];
        index++;
        history.length = index;
      },
      undo: function() {
        if (index <= 0) throw new UndoNotAvailableException();
        index--;
  
        var h = history[index];
        if (h.type == 'set') object[h.key] = h.oldVal;
        else if (h.type == 'new') delete object[h.key];
        else if (h.type == 'del') object[h.key] = h.oldVal;
      },
      redo: function() {
        if (index >= history.length) throw new RedoNotAvailableException();
        
        var h = history[index];
        if (h.type == 'set') object[h.key] = h.newVal;
        else if (h.type == 'new') object[h.key] = h.newVal;
        else if (h.type == 'del') delete object[h.key];
  
        index++;
      }
    };
  }