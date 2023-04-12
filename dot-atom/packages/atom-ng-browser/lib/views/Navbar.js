module.exports = ({ reloadByDefault, showZoomButtons, zoomFactor }) => {
   return  `
      <atom-panel id="atombrowser-navbar" class="padded native-key-bindings">

         <!-- back / reload / refresh-on-save -->
         <button id="atombrowser-btn-back" class="btn"><i class="icon icon-chevron-left"></i></button>
         <button id="atombrowser-btn-reload" class="btn"><i class="icon icon-sync"></i></button>
         <button id="atombrowser-btn-livereload" class="btn ${reloadByDefault ? 'active' : ''}"><i class="icon icon-zap"></i></button>

         <!-- addressbar -->
         <input type="text" id="atombrowser-addressbar" class="input-text native-key-bindings" placeholder="Search, File, Url"/>

         <!-- open devtools -->
         <button id="atombrowser-btn-devtools" class="btn"><i class="icon icon-terminal"></i></button>
         
         <!-- EXPERIMENTAL: ZOOM BAR -->
         <div class="zoom-bar ${showZoomButtons ? "" : "hidden"}">
            <button id="atombrowser-btn-zoom-out" class="btn"><i class="icon icon-dash"></i></button>
            <input readonly id="atombrowser-input-zoom" class='input-text' type='text' placeholder='Text' value="${Math.round(zoomFactor * 100)}" style="width: 4rem; text-align: center;">
            <button id="atombrowser-btn-zoom-in" class="btn"><i class="icon icon-plus"></i></button>
         </div>
      </atom-panel>
   `.trim()
}
