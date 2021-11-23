'use strict';

/* eslint-disable */
const _ = require('underscore');
var Base = require('front/components/Base/Base');
require('./IndexHeroBottle.scss');

const THREE = require('three');
const FBXLoader = require('three/examples/jsm/loaders/FBXLoader').FBXLoader;
const GUI = require('dat.gui').GUI;
const OrbitControls = require('three-orbitcontrols');

module.exports = Base.extend({

    initialize: function() {
        _.bindAll(this, 'onSettingsChange', 'rotate', 'onResize');

        const folder = this.$el.attr('data-assets-folder');



        this.settings = {
            "tc_color": 13882323,
            "tc_aoMapIntensity": 0.4,
            "tc_shininess": 6,
            "tc_specular": 15066597,
            "tb_color": 16250871,
            "tb_shininess": 46,
            "tb_specular": 5592405,
            "tb_opacity": 0.76,
            "g_emissive": 16776653,
            "g_emissiveIntensity": 0,
            "g_color": 16777213,
            "g_reflectivity": 1,
            "g_shininess": 4,
            "g_specular": 16777180,
            "g_opacity": 0.6,
            "lr_color": 12032923,
            "lr_shininess": 5,
            "lr_specular": 16777215,
            "lr_textureOffset": 0,
            "lr_refractionOffset": 3.17,
            "bt_emissive": 16777215,
            "bt_emissiveIntensity": 0.28,
            "bt_color": 16777215,
            "bt_reflectivity": 1,
            "bt_shininess": 40,
            "bt_specular": 16777215,
            "bt_envTransparencyEffectEasingPower": 2.6,
            "bt_envTransparencyEffectMultiplier": 0.61,
            "bt_distanceMin": 2.456,
            "bt_distanceMax": 2.6310000000000002,
            "bt_distanceTransparencyMultiplier": 1,
            "bb_emissive": 16777215,
            "bb_emissiveIntensity": 0.41000000000000003,
            "bb_color": 16777215,
            "bb_reflectivity": 1,
            "bb_shininess": 100,
            "bb_specular": 16777215,
            "bb_envTransparencyEffectEasingPower": 5.800000000000001,
            "bb_envTransparencyEffectMultiplier": 0.9500000000000001,
            "bb_distanceMin": 1.36,
            "bb_distanceMax": 3.338,
            "bb_distanceTransparencyMultiplier": 1,
            "l_emissive": 16777215,
            "l_emissiveIntensity": 0.05,
            "l_color": 16777215,
            "l_shininess": 5,
            "l_specular": 16777215,
            "l_textureOffset": 0.25,
            "lb_emissive": 16777215,
            "lb_emissiveIntensity": 0.05,
            "lb_color": 9868950,
            "lb_shininess": 5,
            "lb_specular": 16777215,
            "bl_emissive": 7039851,
            "bl_emissiveIntensity": 0.3,
            "bl_color": 16053492,
            "bl_aoMapIntensity": 1,
            "bl_reflectivity": 0.64,
            "bl_shininess": 30,
            "bl_specular": 16777215,
            "bl_aoOpacityMultipler": 0.65,
            "bl_envTransparencyEffectEasingPower": 0.7000000000000001,
            "bl_envTransparencyEffectMultiplier": 0.48,
            "la_color": 16777215,
            "la_intensity": 1,
            "pl1_color": 16777215,
            "pl1_intensity": 0.14,
            "pl1_decay": 1,
            "pl1_distance": 0,
            "pl1_x": 65,
            "pl1_y": -20,
            "pl1_z": 46,
            "pl2_color": 16777215,
            "pl2_intensity": 0.04,
            "pl2_decay": 1,
            "pl2_distance": 0,
            "pl2_x": 66,
            "pl2_y": 98,
            "pl2_z": -43,
            "pl3_color": 16777215,
            "pl3_intensity": 0.09,
            "pl3_decay": 1,
            "pl3_distance": 0,
            "pl3_x": -34,
            "pl3_y": -13,
            "pl3_z": 10,
            "pl4_color": 16777215,
            "pl4_intensity": 0,
            "pl4_decay": 1,
            "pl4_distance": 0,
            "pl4_x": 66,
            "pl4_y": 98,
            "pl4_z": 161,
            "pl5_color": 16777215,
            "pl5_intensity": 0,
            "pl5_decay": 1,
            "pl5_distance": 0,
            "pl5_x": 66,
            "pl5_y": 98,
            "pl5_z": 161,
            "pl6_color": 16777215,
            "pl6_intensity": 0.24,
            "pl6_decay": 0.01,
            "pl6_distance": 6.03,
            "pl6_x": 2,
            "pl6_y": -4,
            "pl6_z": -4,
            "rotation_speed": 1.2,
            "temp": 0.131
        };

        this.initialSettings = JSON.stringify(this.settings);


        this.loadingManager = new THREE.LoadingManager();

        this.loadingManager.onLoad = () => {
            if (this.loaded) return;

            this.loaded = true;

            app.vent.on('resize', this.onResize);

            this.onSettingsChange();

            this.onResize();

            this.rotate();

            app.vent.trigger('bottle3d-is-ready');
        };

        this.createScene();

        this.loadTextures(folder);

        this.createMaterials();

        this.loadModel(folder);

        this.createDatGui();
    },


    createDatGui: function() {
        const panel = new GUI({
            width: 450,
            closed: true
        });
        const cb = this.onSettingsChange;
        const s = this.settings;

        const tap_cap = panel.addFolder('tap_cap');
        const tube_bottom = panel.addFolder('tube_bottom');
        const gel = panel.addFolder('gel');
        const label_refraction = panel.addFolder('label_refraction');
        const bubbles_top = panel.addFolder('bubbles_top');
        const bubbles_bottom = panel.addFolder('bubbles_bottom');
        const label = panel.addFolder('label');
        const label_back = panel.addFolder('label_back');
        const bottle = panel.addFolder('bottle');
        const light_ambient = panel.addFolder('light_ambient');
        const point_light_1 = panel.addFolder('point_light_1');
        const point_light_2 = panel.addFolder('point_light_2');
        const point_light_3 = panel.addFolder('point_light_3');
        const point_light_4 = panel.addFolder('point_light_4');
        const point_light_5 = panel.addFolder('point_light_5');
        const point_light_6 = panel.addFolder('point_light_6');

        tap_cap.addColor(s, 'tc_color').onChange(cb);
        tap_cap.add(s, 'tc_aoMapIntensity', 0, 1, 0.01).onChange(cb);
        tap_cap.add(s, 'tc_shininess', 0, 100, 1).onChange(cb);
        tap_cap.addColor(s, 'tc_specular').onChange(cb);

        tube_bottom.addColor(s, 'tb_color').onChange(cb);
        tube_bottom.add(s, 'tb_shininess', 0, 100, 1).onChange(cb);
        tube_bottom.addColor(s, 'tb_specular').onChange(cb);
        tube_bottom.add(s, 'tb_opacity', 0, 1, 0.01).onChange(cb);

        gel.addColor(s, 'g_emissive').onChange(cb);
        gel.add(s, 'g_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        gel.addColor(s, 'g_color').onChange(cb);
        gel.add(s, 'g_reflectivity', 0, 1, 0.01).onChange(cb);
        gel.add(s, 'g_shininess', 0, 100, 1).onChange(cb);
        gel.addColor(s, 'g_specular').onChange(cb);
        gel.add(s, 'g_opacity', 0, 1, 0.01).onChange(cb);

        label_refraction.addColor(s, 'lr_color').onChange(cb);
        label_refraction.add(s, 'lr_shininess', 0, 100, 1).onChange(cb);
        label_refraction.addColor(s, 'lr_specular').onChange(cb);
        label_refraction.add(s, 'lr_textureOffset', 0, 1, 0.01).onChange(cb);
        label_refraction.add(s, 'lr_refractionOffset', 0, 6.242, 0.01).onChange(cb);

        bubbles_top.addColor(s, 'bt_emissive').onChange(cb);
        bubbles_top.add(s, 'bt_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        bubbles_top.addColor(s, 'bt_color').onChange(cb);
        bubbles_top.add(s, 'bt_reflectivity', 0, 1, 0.01).onChange(cb);
        bubbles_top.add(s, 'bt_shininess', 0, 100, 1).onChange(cb);
        bubbles_top.addColor(s, 'bt_specular').onChange(cb);
        bubbles_top.add(s, 'bt_envTransparencyEffectEasingPower', 0, 10, 0.1).onChange(cb);
        bubbles_top.add(s, 'bt_envTransparencyEffectMultiplier', 0, 1, 0.01).onChange(cb);
        bubbles_top.add(s, 'bt_distanceMin', 1, 4, 0.001).onChange(cb);
        bubbles_top.add(s, 'bt_distanceMax', 1, 4, 0.001).onChange(cb);
        bubbles_top.add(s, 'bt_distanceTransparencyMultiplier', 0, 1, 0.01).onChange(cb);

        bubbles_bottom.addColor(s, 'bb_emissive').onChange(cb);
        bubbles_bottom.add(s, 'bb_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        bubbles_bottom.addColor(s, 'bb_color').onChange(cb);
        bubbles_bottom.add(s, 'bb_reflectivity', 0, 1, 0.01).onChange(cb);
        bubbles_bottom.add(s, 'bb_shininess', 0, 100, 1).onChange(cb);
        bubbles_bottom.addColor(s, 'bb_specular').onChange(cb);
        bubbles_bottom.add(s, 'bb_envTransparencyEffectEasingPower', 0.01, 10, 0.1).onChange(cb);
        bubbles_bottom.add(s, 'bb_envTransparencyEffectMultiplier', 0, 1, 0.01).onChange(cb);
        bubbles_bottom.add(s, 'bb_distanceMin', 1, 4, 0.001).onChange(cb);
        bubbles_bottom.add(s, 'bb_distanceMax', 1, 4, 0.001).onChange(cb);
        bubbles_bottom.add(s, 'bb_distanceTransparencyMultiplier', 0, 1, 0.01).onChange(cb);

        label.addColor(s, 'l_emissive').onChange(cb);
        label.add(s, 'l_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        label.addColor(s, 'l_color').onChange(cb);
        label.add(s, 'l_shininess', 0, 100, 1).onChange(cb);
        label.addColor(s, 'l_specular').onChange(cb);
        label.add(s, 'l_textureOffset', 0, 1, 0.01).onChange(cb);

        label_back.addColor(s, 'lb_emissive').onChange(cb);
        label_back.add(s, 'lb_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        label_back.addColor(s, 'lb_color').onChange(cb);
        label_back.add(s, 'lb_shininess', 0, 100, 1).onChange(cb);
        label_back.addColor(s, 'lb_specular').onChange(cb);


        bottle.addColor(s, 'bl_emissive').onChange(cb);
        bottle.add(s, 'bl_emissiveIntensity', 0, 1, 0.01).onChange(cb);
        bottle.addColor(s, 'bl_color').onChange(cb);
        bottle.add(s, 'bl_aoMapIntensity', 0, 1, 0.01).onChange(cb);
        bottle.add(s, 'bl_reflectivity', 0, 1, 0.01).onChange(cb);
        bottle.add(s, 'bl_shininess', 0, 100, 1).onChange(cb);
        bottle.addColor(s, 'bl_specular').onChange(cb);
        bottle.add(s, 'bl_aoOpacityMultipler', 0, 1, 0.01).onChange(cb);
        bottle.add(s, 'bl_envTransparencyEffectEasingPower', 0.01, 10, 0.1).onChange(cb);
        bottle.add(s, 'bl_envTransparencyEffectMultiplier', 0, 1, 0.01).onChange(cb);

        light_ambient.addColor(s, 'la_color').onChange(cb);
        light_ambient.add(s, 'la_intensity', 0, 1, 0.01).onChange(cb);

        point_light_1.addColor(s, 'pl1_color').onChange(cb);
        point_light_1.add(s, 'pl1_intensity', 0, 1, 0.01).onChange(cb);
        point_light_1.add(s, 'pl1_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_1.add(s, 'pl1_distance', 0, 300, 0.01).onChange(cb);
        point_light_1.add(s, 'pl1_x', -200, 200, 1).onChange(cb);
        point_light_1.add(s, 'pl1_y', -200, 200, 1).onChange(cb);
        point_light_1.add(s, 'pl1_z', -200, 200, 1).onChange(cb);

        point_light_2.addColor(s, 'pl2_color').onChange(cb);
        point_light_2.add(s, 'pl2_intensity', 0, 1, 0.01).onChange(cb);
        point_light_2.add(s, 'pl2_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_2.add(s, 'pl2_distance', 0, 300, 0.01).onChange(cb);
        point_light_2.add(s, 'pl2_x', -200, 200, 1).onChange(cb);
        point_light_2.add(s, 'pl2_y', -200, 200, 1).onChange(cb);
        point_light_2.add(s, 'pl2_z', -200, 200, 1).onChange(cb);

        point_light_3.addColor(s, 'pl3_color').onChange(cb);
        point_light_3.add(s, 'pl3_intensity', 0, 1, 0.01).onChange(cb);
        point_light_3.add(s, 'pl3_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_3.add(s, 'pl3_distance', 0, 300, 0.01).onChange(cb);
        point_light_3.add(s, 'pl3_x', -200, 200, 1).onChange(cb);
        point_light_3.add(s, 'pl3_y', -200, 200, 1).onChange(cb);
        point_light_3.add(s, 'pl3_z', -200, 200, 1).onChange(cb);

        point_light_4.addColor(s, 'pl4_color').onChange(cb);
        point_light_4.add(s, 'pl4_intensity', 0, 1, 0.01).onChange(cb);
        point_light_4.add(s, 'pl4_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_4.add(s, 'pl4_distance', 0, 300, 0.01).onChange(cb);
        point_light_4.add(s, 'pl4_x', -200, 200, 1).onChange(cb);
        point_light_4.add(s, 'pl4_y', -200, 200, 1).onChange(cb);
        point_light_4.add(s, 'pl4_z', -200, 200, 1).onChange(cb);

        point_light_5.addColor(s, 'pl5_color').onChange(cb);
        point_light_5.add(s, 'pl5_intensity', 0, 1, 0.01).onChange(cb);
        point_light_5.add(s, 'pl5_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_5.add(s, 'pl5_distance', 0, 300, 0.01).onChange(cb);
        point_light_5.add(s, 'pl5_x', -200, 200, 1).onChange(cb);
        point_light_5.add(s, 'pl5_y', -200, 200, 1).onChange(cb);
        point_light_5.add(s, 'pl5_z', -200, 200, 1).onChange(cb);

        point_light_6.addColor(s, 'pl6_color').onChange(cb);
        point_light_6.add(s, 'pl6_intensity', 0, 1, 0.01).onChange(cb);
        point_light_6.add(s, 'pl6_decay', 0.01, 10, 0.01).onChange(cb);
        point_light_6.add(s, 'pl6_distance', 0, 300, 0.01).onChange(cb);
        point_light_6.add(s, 'pl6_x', -200, 200, 1).onChange(cb);
        point_light_6.add(s, 'pl6_y', -200, 200, 1).onChange(cb);
        point_light_6.add(s, 'pl6_z', -200, 200, 1).onChange(cb);

        panel.add(s, 'rotation_speed', 0.00, 5, 0.1).onChange(cb);
        // panel.add(s, 'temp', -10, 10, 0.001).onChange(cb);

        const storageFuncs = {
            'save': function() {
                console.log('before', JSON.stringify(this.settings));
                localStorage.setItem('bottle3d', JSON.stringify(this.settings));
                console.log('after', JSON.stringify(this.settings));
            }.bind(this),
            'load': function() {
                console.log('before', JSON.stringify(this.settings));
                const settings = localStorage.getItem('bottle3d');

                if (settings) {
                    Object.assign(this.settings, JSON.parse(settings));
                    this.gui.updateDisplay();
                    this.onSettingsChange();
                }
                console.log('after', JSON.stringify(this.settings));
            }.bind(this),
            'reset': function() {
                console.log('before', JSON.stringify(this.settings));
                Object.assign(this.settings, JSON.parse(this.initialSettings));
                this.gui.updateDisplay();
                this.onSettingsChange();
            }.bind(this)
        }
        panel.add(storageFuncs, 'save').name('Save settings');
        panel.add(storageFuncs, 'load').name('Load settings');
        panel.add(storageFuncs, 'reset').name('Reset to initial');

        this.gui = panel;

        $('.dg.ac').css('z-index', 100000);
    },


    loadTextures: function(folder) {
        const textureLoader = new THREE.TextureLoader(this.loadingManager);
        const cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);

        this.textures = {
            label: textureLoader.load(folder + 'label.png'),
            labelBack: textureLoader.load(folder + 'label_back.jpg'),
            env: cubeTextureLoader.load([
                folder + '1.jpg',
                folder + '0.jpg',
                folder + '5.jpg',
                folder + '4.jpg',
                folder + '2.jpg',
                folder + '3.jpg'
            ]),
            envGel: textureLoader.load(folder + 'env_10.jpg'),
            envTube: textureLoader.load(folder + 'env_tube.jpg'),

            bottle_ao: textureLoader.load(folder + 'bottle_AO.jpg'),
            cap_ao: textureLoader.load(folder + 'cap_AO.jpg'),
            cap_tube_ao: textureLoader.load(folder + 'cap_tube_AO.jpg'),
            pet_ao: textureLoader.load(folder + 'pet_AO.jpg'),
            tap_ao: textureLoader.load(folder + 'tap_AO.jpg'),
            tap_tube_ao: textureLoader.load(folder + 'tap_tube_AO.jpg'),
        }

        // setInterval(() => {
        //     // textureLoader.load(folder + 'env_0.jpg?' + Math.random(), (texture) => {
        //     //     texture.mapping = THREE.EquirectangularReflectionMapping;
        //     //     texture.encoding = THREE.sRGBEncoding;

        //     //     this.materials.bottle_front.envMap = texture;
        //     //     this.materials.bottle_front.needsUpdate = true;

        //     //     this.materials.bottle_back.envMap = texture;
        //     //     this.materials.bottle_back.needsUpdate = true;
        //     // });

        //     var textureLoader = new THREE.CubeTextureLoader();

        //     var texture = textureLoader.load([
        //         folder + '1.png',
        //         folder + '0.png',
        //         folder + '5.png',
        //         folder + '4.png',
        //         folder + '2.png',
        //         folder + '3.png'
        //     ], () => {
        //         this.materials.bottle_front.envMap = texture;
        //         this.materials.bottle_front.needsUpdate = true;

        //         this.materials.bottle_back.envMap = texture;
        //         this.materials.bottle_back.needsUpdate = true;
        //     })
        // }, 1000);

        this.textures.label.magFilter = THREE.LinearFilter;
        this.textures.label.minFilter = THREE.LinearMipmapLinearFilter;
        this.textures.label.anisotropy = Math.min(16, this.renderer.capabilities.getMaxAnisotropy());

        this.textures.labelBack.magFilter = THREE.LinearFilter;
        this.textures.labelBack.minFilter = THREE.LinearMipmapLinearFilter;
        this.textures.labelBack.anisotropy = Math.min(16, this.renderer.capabilities.getMaxAnisotropy());
        this.textures.labelBack.offset = new THREE.Vector2(this.settings.lr_textureOffset, 0);
        this.textures.labelBack.wrapS = THREE.RepeatWrapping;

        this.textures.label.offset = new THREE.Vector2(this.settings.l_textureOffset, 0);
        this.textures.label.wrapS = THREE.RepeatWrapping;

        // this.textures.env.mapping = THREE.EquirectangularReflectionMapping;
        // this.textures.env.encoding = THREE.sRGBEncoding;

        this.textures.envGel.mapping = THREE.EquirectangularReflectionMapping;
        this.textures.envGel.encoding = THREE.sRGBEncoding;

        this.textures.envTube.mapping = THREE.EquirectangularReflectionMapping;
        this.textures.envTube.encoding = THREE.sRGBEncoding;
    },


    createMaterials: function() {
        const settings = this.settings;

        this.materials = {};

        this.materials.tap = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.tc_color),
            aoMap: this.textures.tap_ao,
            aoMapIntensity: settings.tc_aoMapIntensity,
            shininess: settings.tc_shininess,
            specular: new THREE.Color(settings.tc_specular),
            side: THREE.DoubleSide
        });

        this.materials.tap_tube = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.tc_color),
            aoMap: this.textures.tap_tube_ao,
            aoMapIntensity: settings.tc_aoMapIntensity,
            shininess: settings.tc_shininess,
            specular: new THREE.Color(settings.tc_specular),
        });

        this.materials.cap = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.tc_color),
            aoMap: this.textures.cap_ao,
            aoMapIntensity: settings.tc_aoMapIntensity,
            shininess: settings.tc_shininess,
            specular: new THREE.Color(settings.tc_specular),
        });

        this.materials.cap_tube = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.tc_color),
            aoMap: this.textures.cap_tube_ao,
            aoMapIntensity: settings.tc_aoMapIntensity,
            shininess: settings.tc_shininess,
            specular: new THREE.Color(settings.tc_specular),
        });

        this.materials.tube_bottom = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.tb_color),
            shininess: settings.tb_shininess,
            envMap: this.textures.envTube,
            transparent: true,
            specular: new THREE.Color(settings.tb_specular),
            opacity: settings.tb_opacity,
            side: THREE.FrontSide
        });
        const tubeFragmentAdd = `diffuseColor.a = pow(outgoingLight.r, 0.3) * diffuseColor.a;`;

        //create at runtime cause "WebGLPrograms adds onBeforeCompile.toString() to the program hash so this shouldn't affect other built-in materials used in the scene." so we need different function body
        this.materials.tube_bottom.onBeforeCompile = new Function('shader',
            `shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', '#include <envmap_fragment>\\n${tubeFragmentAdd}');`
        );


        this.materials.gel_top = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.g_emissive),
            emissiveIntensity: settings.g_emissiveIntensity,
            color: new THREE.Color(settings.g_color),
            reflectivity: settings.g_reflectivity,
            envMap: this.textures.envGel,
            transparent: true,
            shininess: settings.g_shininess,
            specular: new THREE.Color(settings.g_specular),
            opacity: settings.g_opacity,
            side: THREE.FrontSide,
        });

        this.materials.gel_bottom = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.g_emissive),
            emissiveIntensity: settings.g_emissiveIntensity,
            color: new THREE.Color(settings.g_color),
            envMap: this.textures.envGel,
            reflectivity: settings.g_reflectivity,
            transparent: true,
            shininess: settings.g_shininess,
            specular: new THREE.Color(settings.g_specular),
            opacity: settings.g_opacity,
            side: THREE.FrontSide,
        });

        this.materials.gel_bottom_label = new THREE.MeshPhongMaterial({
            color: new THREE.Color(settings.lr_color),
            map: this.textures.labelBack,
            shininess: settings.lr_shininess,
            specular: new THREE.Color(settings.lr_specular),
            transparent: true,
            side: THREE.BackSide,
        });

        this.materials.bubbles_top = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.bt_emissive),
            emissiveIntensity: settings.bt_emissiveIntensity,
            color: new THREE.Color(settings.bt_color),
            envMap: this.textures.env,
            reflectivity: settings.bt_reflectivity,
            transparent: true,
            shininess: settings.bt_shininess,
            specular: new THREE.Color(settings.bt_specular),
            side: THREE.FrontSide,
        });

        // `#include <envmap_fragment>\ndiffuseColor.a = pow(outgoingLight.g, 4.0) * 2.0 * (1.0 - 0.8 *(vViewPosition.z - 12.2) / (12.6 - 12.2));`
        const bubblesTopFragmentAdd = `diffuseColor.a = pow(outgoingLight.g, ${settings.bt_envTransparencyEffectEasingPower.toFixed(2)}) * ${settings.bt_envTransparencyEffectMultiplier.toFixed(2)} * (1.0 - ${settings.bt_distanceTransparencyMultiplier.toFixed(2)} * (vViewPosition.z - ${settings.bt_distanceMin.toFixed(2)}) / (${settings.bt_distanceMax.toFixed(2)} - ${settings.bt_distanceMin.toFixed(2)}));`;

        //create at runtime cause "WebGLPrograms adds onBeforeCompile.toString() to the program hash so this shouldn't affect other built-in materials used in the scene." so we need different function body

        this.materials.bubbles_top.onBeforeCompile = new Function('shader',
            `shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', '#include <envmap_fragment>\\n${bubblesTopFragmentAdd}');`
        );


        this.materials.bubbles_bottom = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.bb_emissive),
            emissiveIntensity: settings.bb_emissiveIntensity,
            color: new THREE.Color(settings.bb_color),
            envMap: this.textures.env,
            reflectivity: settings.bb_reflectivity,
            transparent: true,
            shininess: settings.bb_shininess,
            specular: new THREE.Color(settings.bb_specular),
            side: THREE.FrontSide,
        });

        // `#include <envmap_fragment>\ndiffuseColor.a = pow(outgoingLight.g, 4.0) * 2.0 * (1.0 - 0.8 *(vViewPosition.z - 12.2) / (12.6 - 12.2));`
        const bubblesBottomFragmentAdd = `diffuseColor.a = pow(outgoingLight.g, ${settings.bb_envTransparencyEffectEasingPower.toFixed(2)}) * ${settings.bb_envTransparencyEffectMultiplier.toFixed(2)} * (1.0 - ${settings.bb_distanceTransparencyMultiplier.toFixed(2)} * (vViewPosition.z - ${settings.bb_distanceMin.toFixed(2)}) / (${settings.bb_distanceMax.toFixed(2)} - ${settings.bb_distanceMin.toFixed(2)}));`;

        //create at runtime cause "WebGLPrograms adds onBeforeCompile.toString() to the program hash so this shouldn't affect other built-in materials used in the scene." so we need different function body

        this.materials.bubbles_bottom.onBeforeCompile = new Function('shader',
            `shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', '#include <envmap_fragment>\\n${bubblesBottomFragmentAdd}');`
        );


        this.materials.label = new THREE.MeshPhongMaterial({
            emissiveMap: this.textures.label,
            emissive: new THREE.Color(settings.l_emissive),
            emissiveIntensity: settings.l_emissiveIntensity,
            color: new THREE.Color(settings.l_color),
            map: this.textures.label,
            shininess: settings.l_shininess,
            specular: new THREE.Color(settings.l_specular),
            side: THREE.FrontSide,
        });

        this.materials.label_back = new THREE.MeshPhongMaterial({
            emissiveMap: this.textures.label,
            emissive: new THREE.Color(settings.lb_emissive),
            emissiveIntensity: settings.lb_emissiveIntensity,
            color: new THREE.Color(settings.lb_color),
            map: this.textures.label,
            shininess: settings.lb_shininess,
            specular: new THREE.Color(settings.lb_specular),
            side: THREE.BackSide,
        });

        this.materials.bottle_front = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.bl_emissive),
            emissiveIntensity: settings.bl_emissiveIntensity,
            color: new THREE.Color(settings.bl_color),
            envMap: this.textures.env,
            aoMap: this.textures.bottle_ao,
            aoMapIntensity: settings.bl_aoMapIntensity,
            transparent: true,
            reflectivity: settings.bl_reflectivity,
            shininess: settings.bl_shininess,
            specular: new THREE.Color(settings.bl_specular),
            side: THREE.FrontSide,
            // depthWrite: false
        });


        // `#include <envmap_fragment>
        // float aoOpacity = 1.0 - reflectedLight.indirectDiffuse.r;
        // diffuseColor.a = aoOpacity * 0.5 + pow(outgoingLight.r, 6.0) * 0.55;`

        const bottleFragmentAddBefore = `vec3 outgoingLightPrev = outgoingLight;`;

        const bottleFragmentAdd = `float aoOpacity = 1.0 - reflectedLight.indirectDiffuse.r;\\ndiffuseColor.a = aoOpacity * ${settings.bl_aoOpacityMultipler.toFixed(2)} + pow(outgoingLight.r, ${settings.bl_envTransparencyEffectEasingPower.toFixed(2)}) * ${settings.bl_envTransparencyEffectMultiplier.toFixed(2)}; if (vWorldPosition.z > 0.1335) diffuseColor.a = 0.0;`;

        //create at runtime cause "WebGLPrograms adds onBeforeCompile.toString() to the program hash so this shouldn't affect other built-in materials used in the scene." so we need different function body
        this.materials.bottle_front.onBeforeCompile = new Function('shader',
            `shader.fragmentShader = shader.fragmentShader.replace('#include <envmap_fragment>', '${bottleFragmentAddBefore}\\n#include <envmap_fragment>\\n${bottleFragmentAdd}');`
        );


        this.materials.bottle_back = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.bl_emissive),
            emissiveIntensity: settings.bl_emissiveIntensity,
            color: new THREE.Color(settings.bl_color),
            envMap: this.textures.env,
            aoMap: this.textures.bottle_ao,
            reflectivity: settings.bl_aoMapIntensity,
            aoMapIntensity: settings.bl_reflectivity,
            transparent: true,
            shininess: settings.bl_shininess,
            specular: new THREE.Color(settings.bl_specular),
            side: THREE.BackSide,
            // depthWrite: false

        });
        this.materials.bottle_back.onBeforeCompile = this.materials.bottle_front.onBeforeCompile;

        this.materials.pet_front = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(settings.bl_emissive),
            emissiveIntensity: settings.bl_emissiveIntensity,
            color: new THREE.Color(settings.bl_color),
            envMap: this.textures.env,
            aoMap: this.textures.pet_ao,
            aoMapIntensity: settings.bl_aoMapIntensity,
            reflectivity: settings.bl_reflectivity,
            transparent: true,
            shininess: settings.bl_shininess,
            specular: new THREE.Color(settings.bl_specular),
            side: THREE.FrontSide,

        });
        this.materials.pet_front.onBeforeCompile = this.materials.bottle_front.onBeforeCompile;
    },



    loadModel: function(folder) {
        const modelLoader = new FBXLoader(this.loadingManager);

        modelLoader.load(folder + 'bottle.fbx', (object) => {

            object.scale.set(0.01, 0.01, 0.01);

            this.objects = {
                tap: object.children[0],
                tap_tube: object.children[1],
                cap: object.children[2],
                cap_tube: object.children[3],
                label: object.children[4],
                tube_bottom: object.children[5],
                bubbles_bottom: object.children[6],
                pet_front: object.children[7],
                bottle_front: object.children[8],
                gel_top: object.children[9],
                gel_bottom_label: object.children[10],
                bubbles_top: object.children[11],
                gel_bottom: object.children[12],

                bottle_back: object.children[8].clone(),
                label_back: object.children[4].clone(),
            };

            console.log(object);

            object.add(this.objects.bottle_back);
            object.add(this.objects.label_back);

            this.objects.bottle_back.renderOrder = 0;
            this.objects.tube_bottom.renderOrder = 2;
            this.objects.gel_bottom.renderOrder = 3;
            this.objects.gel_top.renderOrder = 3;
            this.objects.bottle_front.renderOrder = 4;
            this.objects.pet_front.renderOrder = 5;

            //ao map requires second set of uv coordinates
            for (let k in this.objects) {
                if (this.objects.hasOwnProperty(k)) {
                    this.objects[k].geometry.setAttribute('uv2', new THREE.BufferAttribute(this.objects[k].geometry.attributes.uv.array, 2));
                    // if (k != 'bottle_front' && k != 'bottle_back') {
                    //     this.objects[k].visible = false;
                    // }
                }
            }

            this.assignMaterials();

            this.scene.add(object);

            this.model = object;
        });
    },


    assignMaterials: function() {
        this.objects.pet_front.material = this.materials.pet_front;
        this.objects.gel_bottom.material = this.materials.gel_bottom;
        this.objects.bubbles_top.material = this.materials.bubbles_top;
        this.objects.bubbles_bottom.material = this.materials.bubbles_bottom;
        this.objects.tube_bottom.material = this.materials.tube_bottom;
        this.objects.label.material = this.materials.label;
        this.objects.label_back.material = this.materials.label_back;
        this.objects.cap_tube.material = this.materials.cap_tube;
        this.objects.cap.material = this.materials.cap;
        this.objects.tap_tube.material = this.materials.tap_tube;
        this.objects.tap.material = this.materials.tap;
        this.objects.gel_top.material = this.materials.gel_top;
        this.objects.bottle_front.material = this.materials.bottle_front;
        this.objects.gel_bottom_label.material = this.materials.gel_bottom_label;
        this.objects.bottle_back.material = this.materials.bottle_back;
    },


    createScene: function() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.physicallyBasedShading = true;
        this.renderer.setPixelRatio(window.devicePixelRatio || 1); //set retina for uses devices
        this.$el.append(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(5.323, 1, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(-0.221990799890845, 2.0964577274926497, -0.6492141454906645);
        this.camera.rotation.set(-1.9118879028136622, -0.10033855875742306, -2.8665476439525417);
        this.scene.add(this.camera);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enableZoom = true;
        // this.controls.enablePan = true;
        // this.controls.zoomSpeed = 0.2;

        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.pointLight1 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight1.position.set(10, 20, 5);
        this.scene.add(this.pointLight1);

        this.pointLight2 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight2.position.set(10, 20, 15);
        this.scene.add(this.pointLight2);

        this.pointLight3 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight3.position.set(10, 20, 5);
        this.scene.add(this.pointLight3);

        this.pointLight4 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight4.position.set(10, 20, 15);
        this.scene.add(this.pointLight4);

        this.pointLight5 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight5.position.set(10, 20, 5);
        this.scene.add(this.pointLight5);

        this.pointLight6 = new THREE.PointLight(0xffffff, 0.07);
        this.pointLight6.position.set(10, 20, 15);
        this.scene.add(this.pointLight6);
    },


    rotate: function() {
        this.rafID = requestAnimationFrame(this.rotate);

        this.model.rotation.set(0, 0, this.model.rotation.z - this.settings.rotation_speed / 100);

        this.objects.gel_bottom_label.rotation.z = -this.model.rotation.z + this.settings.lr_refractionOffset;

        this.textures.labelBack.offset = new THREE.Vector2(this.settings.lr_textureOffset - this.model.rotation.z / (Math.PI * 2), 0);

        // this.controls.update();
        // console.log('pos', this.camera.position.x, this.camera.position.y, this.camera.position.z);
        // console.log('rot', this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);

        this.renderer.render(this.scene, this.camera);
    },


    play: function() {
        cancelAnimationFrame(this.rafID);
        this.rotate();
    },


    pause: function() {
        cancelAnimationFrame(this.rafID);
    },

    onSettingsChange: function() {
        const settings = this.settings;

        this.textures.labelBack.offset = new THREE.Vector2(settings.lr_textureOffset, 0);
        this.textures.label.offset = new THREE.Vector2(settings.l_textureOffset, 0);

        this.ambientLight.color = new THREE.Color(settings.la_color);
        this.ambientLight.intensity = settings.la_intensity;

        this.pointLight1.color = new THREE.Color(settings.pl1_color);
        this.pointLight1.intensity = settings.pl1_intensity;
        this.pointLight1.decay = settings.pl1_decay;
        this.pointLight1.distance = settings.pl1_distance;
        this.pointLight1.position.set(settings.pl1_x, settings.pl1_y, settings.pl1_z);

        this.pointLight2.color = new THREE.Color(settings.pl2_color);
        this.pointLight2.intensity = settings.pl2_intensity;
        this.pointLight2.decay = settings.pl2_decay;
        this.pointLight2.distance = settings.pl2_distance;
        this.pointLight2.position.set(settings.pl2_x, settings.pl2_y, settings.pl2_z);

        this.pointLight3.color = new THREE.Color(settings.pl3_color);
        this.pointLight3.intensity = settings.pl3_intensity;
        this.pointLight3.decay = settings.pl3_decay;
        this.pointLight3.distance = settings.pl3_distance;
        this.pointLight3.position.set(settings.pl3_x, settings.pl3_y, settings.pl3_z);

        this.pointLight4.color = new THREE.Color(settings.pl4_color);
        this.pointLight4.intensity = settings.pl4_intensity;
        this.pointLight4.decay = settings.pl4_decay;
        this.pointLight4.distance = settings.pl4_distance;
        this.pointLight4.position.set(settings.pl4_x, settings.pl4_y, settings.pl4_z);

        this.pointLight5.color = new THREE.Color(settings.pl5_color);
        this.pointLight5.intensity = settings.pl5_intensity;
        this.pointLight5.decay = settings.pl5_decay;
        this.pointLight5.distance = settings.pl5_distance;
        this.pointLight5.position.set(settings.pl5_x, settings.pl5_y, settings.pl5_z);

        this.pointLight6.color = new THREE.Color(settings.pl6_color);
        this.pointLight6.intensity = settings.pl6_intensity;
        this.pointLight6.decay = settings.pl6_decay;
        this.pointLight6.distance = settings.pl6_distance;
        this.pointLight6.position.set(settings.pl6_x, settings.pl6_y, settings.pl6_z);

        this.createMaterials();
        this.assignMaterials();
    },


    onResize: function() {
        const width = this.$el.width();
        const height = this.$el.height();

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);
    },
});